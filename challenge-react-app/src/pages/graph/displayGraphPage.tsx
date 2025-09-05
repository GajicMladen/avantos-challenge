import { useEffect, useState } from "react";
import { useLazyGetBlueprintsQuery } from "../../service/blueprints/blueprints-service"
import { CustomFlowGraph, EdgeToDraw, NodeToDraw } from "./customFlowGraph";

export const DisplayGraphPage = () => {

    const [getBluePrints, { data: blueprints, isSuccess, isLoading, isError }] = useLazyGetBlueprintsQuery();

    useEffect(() => {
        getBluePrints({
            tenantId: "nevermind",
            blueprintId: "also"
        });
    }, [getBluePrints])

    const [nodes, setNodes] = useState<NodeToDraw[]>([]);
    const [edges, setEdges] = useState<EdgeToDraw[]>([]);

    useEffect(() => {
        if (blueprints != undefined && blueprints.nodes.length > 0 && blueprints.edges.length > 0) {
            setNodes(blueprints.nodes.map(x => ({ id: x.id, position: { x: x.position.x, y: x.position.y }, data: { label: x.data.name } })));
            setEdges(blueprints.edges.map(x => ({ id: `${x.source}-${x.target}`, source: x.source, target: x.target })));

        }
    }, [
        blueprints
    ])

    return <>
        {blueprints?.nodes.length &&
            <CustomFlowGraph nodes={nodes} edges={edges} />}
    </>
}