import { Dialog } from "primereact/dialog"
import { Accordion, AccordionTab } from "primereact/accordion"
import { Button } from "primereact/button"
import styles from "./forms.module.scss"
import { Node } from "@xyflow/react"
import { getDataSections } from "../../utils/util"
import { DependencyData } from "../../model/graph"
import { useState } from "react"
import { DataOption } from "../../model/fieldSelection"
import { useAppDispatch } from "../../sotore/store.hooks"
import { updateFormFieldMapping } from "../../sotore/graph-slice"

export type SelectFieldModalProps = {
    onClose: () => void,
    node: Node
    field: string
}

export const SelectFieldModal = (props: SelectFieldModalProps) => {

    const dispatch = useAppDispatch();

    const dataSections = getDataSections((props.node.data.dependencyData as DependencyData));

    const [selectedOption, setSelectedOption] = useState<DataOption>();

    const footerContent = (
        <div>
            <Button label="Cancel" onClick={props.onClose} className="p-button-text" />
            <Button label="Save" onClick={() => {
                dispatch(updateFormFieldMapping({
                    nodeId: props.node.id,
                    fieldName: props.field,
                    mapping: {
                        ...selectedOption
                    }
                }));
                props.onClose();
            }} />
        </div>
    );

    return <>
        <Dialog header={`Select Field for '${props.field}' in 
        ${props.node.data.label}`} visible={true} style={{ width: '50vw' }} onHide={props.onClose} className={styles.Dialog}
            footer={footerContent}
        >
            <div className={styles.splitContent}>
                <Accordion>
                    {dataSections.map((dataItem, index) => {
                        return <AccordionTab key={index} header={dataItem.title}>
                            <div className={styles.options}>
                                {dataItem.options.map(((option, index) => {
                                    return <div key={index} className={`${styles.option} ${option.value == selectedOption?.value ? styles.active : ''}`} onClick={
                                        () => {
                                            setSelectedOption(option)
                                        }
                                    }>
                                        {option.label}
                                    </div>
                                }))}
                            </div>
                        </AccordionTab>
                    })}

                </Accordion>
                <div className={styles.selectedValue}>
                    <i>Selected Value: </i>
                    {selectedOption && <span> <b>
                        {selectedOption.value}
                    </b>
                    </span>}
                </div>
            </div>

        </Dialog>
    </>
}