import { useEffect } from "react";
import { useLazyGetBlueprintsQuery } from "../../service/blueprints/blueprints-service"
import { CustomFlowGraph } from "./customFlowGraph";
import { mapDtoEdgesToGraphEdges, mapDtoNodesToGraphNodes } from "../../service/blueprints/mappers/graphMapper";
import { useAppDispatch, useAppSelector } from "../../sotore/store.hooks";
import { setGraph } from "../../sotore/graph-slice";

export const DisplayGraphPage = () => {

    const dispatch = useAppDispatch();
    const nodes = useAppSelector((state) => state.graph.nodes);
    const edges = useAppSelector((state) => state.graph.edges);

    const [getBluePrints, { data: blueprints }] = useLazyGetBlueprintsQuery();

    useEffect(() => {
        getBluePrints({
            tenantId: "nevermind",
            blueprintId: "also"
        });
    }, [getBluePrints])

    useEffect(() => {
        if (blueprints !== undefined && blueprints.nodes.length > 0 && blueprints.edges.length > 0) {
            console.log('ovde');
            dispatch(setGraph({
                nodes: mapDtoNodesToGraphNodes(blueprints.forms, blueprints.nodes),
                edges: mapDtoEdgesToGraphEdges(blueprints.edges)
            }));

        }
    }, [blueprints, dispatch])

    return <>
        {nodes.length > 0 &&
            <CustomFlowGraph nodes={nodes} edges={edges} />}

    </>
}