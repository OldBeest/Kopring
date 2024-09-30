//list.tsx

import { useState } from "react"

const List = (): any => {
    const [lists, setLists] = useState([] as any | undefined);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [counts, setCounts] = useState(1); 
    const [blockNum, setBlockNum] = useState(0);
}

return (
    <ListPagenation 
    limit={limit}
    page={page}
    setPage={setPage}
    blockNum={blockNum}
    setBlockNum={setBlackNum}
    counts={counts}/>
    
);

export default List;