
import { Dialog } from 'primereact/dialog';
import styles from "./forms.module.scss";
import { DependencyData, FieldMapping } from '../../model/graph';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../sotore/store.hooks';
import { DatabaseIcon, DeleteIcon } from '../../assets/icons';
import { SelectFieldModal } from './selectFieldModal';
import { deleteFromFileMapping } from '../../sotore/graph-slice';


interface PrefillFormModelProps {
    onClose: () => void;
    nodeId: string;
}

export default function PrefillFormModal(props: PrefillFormModelProps) {

    const dispatch = useAppDispatch()
    const [showSelectFieldModal, setShowSelectSideModal] = useState(false);
    const [selectedField, setSelectedField] = useState("");

    const nodes = useAppSelector((state) => state.graph.nodes);
    const node = nodes.find(x => x.id === props.nodeId);

    return <>
        {node &&
            <div className={styles.DialogBG}>
                <Dialog header={node.data.label as string} visible={true} style={{ width: '50vw' }} onHide={props.onClose} className={styles.Dialog}>
                    <div className={styles.fields}>
                        {(node.data.formFields as string[]).map((field: string) => {
                            const mappedValue = (node.data.fieldMappings as Record<string, FieldMapping> || {})[field];

                            if (mappedValue) {
                                return (
                                    <div
                                        key={field}
                                        className={styles.prefilledField}
                                    >
                                        <span>{field}</span>
                                        <span>
                                            {mappedValue.source}.{mappedValue.label}
                                        </span>
                                        <DeleteIcon className={styles.deleteIcon} onClick={() => {
                                            dispatch(deleteFromFileMapping({
                                                nodeId: node.id,
                                                fieldName: field
                                            }))
                                        }} />
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={field}
                                    className={styles.noPrefilledField}
                                    onClick={() => {
                                        setShowSelectSideModal(true);
                                        setSelectedField(field)
                                    }}
                                >
                                    <DatabaseIcon />
                                    <span>{field}</span>
                                </div>
                            );
                        })}
                    </div>
                </Dialog>
                {(showSelectFieldModal && selectedField) &&
                    <SelectFieldModal onClose={() => setShowSelectSideModal(false)} node={node} field={selectedField} />}
            </div>}
    </>
}
