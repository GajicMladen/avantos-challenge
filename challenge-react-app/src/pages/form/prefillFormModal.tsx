
import { Dialog } from 'primereact/dialog';
import styles from "./forms.module.scss";
import { DependencyData, FieldMapping } from '../../model/blueprint';
import { useState } from 'react';


interface PrefillFormModelProps {
    onClose: () => void;
    data: {
        label: string;
        formFields: string[];
        dependencyData: DependencyData;
    };
    nodeId: string;
    initialFieldMappings: Record<string, FieldMapping>;
}

export default function PrefillFormModal(props: PrefillFormModelProps) {

    const [fieldMappings, setFieldMappings] =
        useState<Record<string, FieldMapping>>(props.initialFieldMappings);

    return (
        <div className={styles.DialogBG}>
            <Dialog header={props.data.label} visible={true} style={{ width: '50vw' }} onHide={props.onClose} className={styles.Dialog}>
                idemo formica jako jako
                <div className="grid gap-4">
                    {props.data.formFields.map((field: string) => {
                        const mappedValue = fieldMappings[field];

                        if (mappedValue) {
                            return (
                                <div
                                    key={field}
                                    className="flex items-center bg-gray-100 justify-between w-full h-9 p-2 border rounded-xl"
                                >
                                    <span className="text-sm font-medium">
                                        {mappedValue.source}.{mappedValue.label}
                                    </span>
                                    <button
                                        //   onClick={() => handleRemoveMapping(field)}
                                        className="text-sm w-5 h-5 leading-none cursor-pointer hover:rounded-full hover:bg-gray-300"
                                        title="Remove mapping"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={field}
                                className="flex items-center justify-start gap-2 w-full bg-gray-100 text-gray-500 font-normal border rounded-md p-2 border-dashed hover:border-blue-500 hover:bg-blue-50 hover:text-gray-500 cursor-pointer"
                            //   onClick={() => handleFieldClick(field)}
                            >
                                <img src={""} alt="database" className="w-4 h-4" />
                                <span>{field}</span>
                            </button>
                        );
                    })}
                </div>
            </Dialog>
        </div>
    )
}
