import {database} from '../../firebase/firebase.js';
import {ref, set} from 'firebase/database';

const tsvData = `Match\tTeam\tName\tAlliance\tL1\tL2\tL3\tL4\tautoRemoveAlgae\tleftStartingZone\tautoL1\tautoL2\tautoL3\tautoL4\tremoveAlgae\tprocessorScore\tnetScore\tInfo\tdefensivePins\tclimbOption
11\t5928\t\tblue\t1\t0\t0\t0\t0\tTRUE\t0\t0\t1\t3\t3\t2\t0\tFALSE\t0\t
11\t6104\t\tblue\t0\t0\t0\t0\t0\tTRUE\t0\t2\t1\t0\t0\t0\t0\tFALSE\t0\t
11\t7845\t\tblue\t0\t2\t0\t0\t0\tTRUE\t1\t2\t3\t0\t2\t1\t0\tTRUE\t0\t
12\t3083\t\tblue\t0\t0\t0\t0\t0\tTRUE\t3\t3\t4\t3\t0\t0\t0\tFALSE\t0\t
12\t3211\t\tblue\t1\t0\t0\t0\t0\tTRUE\t0\t0\t0\t6\t0\t0\t0\tTRUE\t0\t
12\t5554\t\tblue\t0\t0\t0\t2\t0\tTRUE\t3\t4\t2\t0\t3\t0\t3\tFALSE\t0\t
12\t5951\t\tblue\t0\t0\t0\t3\t0\tTRUE\t2\t0\t7\t1\t2\t0\t0\tTRUE\t0\t
12\t6740\t\tblue\t0\t0\t0\t0\t0\tTRUE\t0\t0\t1\t3\t1\t0\t0\tTRUE\t0\t
12\t7039\t\tblue\t0\t0\t0\t3\t0\tTRUE\t1\t3\t4\t3\t3\t0\t3\tTRUE\t0\t
13\t1574\t\tblue\t0\t0\t0\t2\t0\tTRUE\t1\t1\t5\t2\t2\t0\t0\tTRUE\t0\t
13\t1577\t\tblue\t0\t0\t0\t1\t2\tTRUE\t3\t2\t2\t2\t2\t0\t2\tTRUE\t0\t
13\t2096\t\tblue\t0\t0\t0\t3\t0\tTRUE\t1\t2\t5\t2\t2\t0\t2\tFALSE\t0\t
13\t3075\t\tblue\t0\t0\t0\t2\t1\tTRUE\t0\t3\t5\t4\t0\t0\t0\tTRUE\t0\t
13\t5987\t\tblue\t0\t0\t0\t0\t0\tTRUE\t1\t2\t4\t3\t1\t0\t0\tTRUE\t0\t
13\t8223\t\tblue\t0\t0\t0\t1\t0\tTRUE\t2\t2\t1\t1\t2\t0\t0\tTRUE\t0\t
14\t1937\t\tblue\t0\t0\t0\t0\t0\tTRUE\t1\t2\t5\t1\t1\t0\t0\tTRUE\t0\t
14\t2230\t\tblue\t0\t0\t0\t3\t0\tTRUE\t1\t3\t4\t2\t2\t0\t0\tTRUE\t0\t
14\t3388\t\tblue\t0\t0\t0\t0\t0\tTRUE\t0\t2\t1\t0\t1\t1\t0\tFALSE\t0\t
14\t5614\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t5\t5\t3\t2\t0\t1\tTRUE\t0\t
14\t5715\t\tred\t0\t0\t0\t0\t0\tTRUE\t2\t0\t3\t3\t3\t0\t2\tFALSE\t0\t
15\t5135\t\tred\t0\t0\t0\t0\t0\tTRUE\t5\t0\t0\t0\t0\t0\t0\tFALSE\t0\t
15\t6738\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t0\t0\t0\t2\t0\t0\tFALSE\t0\t
15\t9738\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t3\t3\t0\t0\tFALSE\t0\t
16\t1576\t\tred\t0\t0\t0\t1\t0\tTRUE\t1\t0\t0\t1\t0\t0\t0\tFALSE\t1\t
16\t2630\t\tred\t0\t0\t0\t3\t0\tTRUE\t4\t2\t5\t4\t2\t0\t2\tTRUE\t0\t
16\t4416\t\tred\t3\t0\t0\t0\t0\tTRUE\t2\t0\t0\t0\t0\t3\t0\tFALSE\t0\t
16\t5635\t\tred\t0\t0\t2\t0\t1\tTRUE\t0\t3\t2\t0\t1\t0\t0\tFALSE\t0\t
16\t5990\t\tred\t0\t0\t0\t3\t0\tTRUE\t2\t4\t7\t2\t3\t0\t2\tFALSE\t0\t
16\t6104\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t1\t
17\t2231\t\tred\t0\t0\t0\t3\t0\tTRUE\t1\t0\t5\t3\t4\t0\t3\tTRUE\t0\t
17\t3083\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t2\t0\t0\t0\tFALSE\t5\t
17\t3339\t\tred\t0\t1\t0\t3\t0\tTRUE\t0\t0\t7\t3\t6\t0\t4\tTRUE\t0\t
17\t4320\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t4\t5\t2\t0\t0\t0\tFALSE\t0\t
17\t6740\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t1\t3\t3\t0\t0\t0\tTRUE\t0\t
18\t1577\t\tred\t0\t0\t0\t1\t2\tTRUE\t1\t3\t3\t4\t1\t1\t0\tTRUE\t0\t
18\t2096\t\tred\t3\t0\t0\t0\t0\tTRUE\t2\t1\t1\t2\t2\t0\t2\tFALSE\t0\t
18\t5554\t\tred\t0\t0\t0\t0\t0\tTRUE\t1\t0\t0\t6\t0\t0\t0\tTRUE\t0\t
18\t7845\t\tred\t0\t1\t0\t0\t0\tTRUE\t4\t2\t4\t0\t2\t0\t0\tFALSE\t0\t
18\t9740\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t0\t
19\t1574\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t1\t5\t4\t1\t0\t1\tTRUE\t0\t
19\t1937\t\tred\t0\t0\t0\t1\t0\tTRUE\t2\t3\t2\t0\t2\t0\t0\tTRUE\t0\t
19\t1942\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t1\t1\t11\t1\t0\t0\tTRUE\t0\t
19\t3388\t\tred\t0\t0\t1\t0\t1\tTRUE\t2\t4\t1\t0\t0\t0\t0\tFALSE\t0\t
19\t4661\t\tred\t0\t0\t0\t0\t0\tFALSE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t0\t
19\t7067\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t1\t
1\t3316\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t3\t1\t3\t0\t0\t0\tFALSE\t0\t
1\t4338\t\tred\t0\t0\t0\t1\t0\tTRUE\t3\t4\t2\t2\t1\t0\t0\tFALSE\t0\t
1\t4661\t\tred\t0\t0\t1\t0\t0\tTRUE\t0\t0\t4\t0\t3\t6\t0\tFALSE\t0\t
1\t5135\t\tred\t0\t0\t0\t0\t0\tTRUE\t9\t0\t0\t0\t0\t0\t0\tFALSE\t0\t
1\t5951\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t3\t6\t3\t2\t0\t1\tTRUE\t0\t
20\t1690\t\tred\t0\t0\t0\t4\t0\tTRUE\t8\t7\t6\t4\t2\t1\t1\tTRUE\t0\t
20\t3065\t\tred\t0\t0\t0\t1\t0\tTRUE\t1\t1\t2\t2\t2\t4\t0\tFALSE\t0\t
20\t5614\t\tred\t0\t0\t0\t3\t0\tTRUE\t1\t4\t4\t1\t2\t1\t1\tTRUE\t0\t
20\t5987\t\tred\t0\t0\t0\t0\t0\tTRUE\t1\t3\t2\t1\t2\t0\t1\tTRUE\t0\t
20\t7039\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t2\t2\t3\t2\t0\t0\tFALSE\t0\t
20\t8175\t\tred\t0\t0\t1\t0\t1\tTRUE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t1\t
21\t3075\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t1\t3\t6\t2\t0\t1\tFALSE\t0\t
21\t3211\t\tred\t0\t0\t0\t1\t0\tTRUE\t1\t3\t2\t2\t1\t0\t0\tTRUE\t0\t
21\t5928\t\tred\t0\t0\t0\t1\t0\tTRUE\t0\t4\t2\t2\t0\t0\t0\tFALSE\t0\t
21\t5951\t\tred\t0\t0\t0\t3\t0\tTRUE\t3\t0\t5\t2\t6\t0\t3\tTRUE\t0\t
21\t7112\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t3\t5\t0\t0\t0\t0\tFALSE\t0\t
21\t9738\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t0\t3\t0\t0\tFALSE\t0\t
22\t2230\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t3\t7\t1\t4\t2\t1\tTRUE\t0\t
22\t4586\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t0\t3\t0\t0\t0\tFALSE\t2\t
22\t4590\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t4\t6\t2\t3\t2\t1\tTRUE\t0\t
22\t4744\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t3\t4\t6\t0\t0\t0\tTRUE\t0\t
22\t5135\t\tred\t1\t0\t0\t0\t0\tTRUE\t6\t0\t0\t0\t0\t0\t0\tFALSE\t1\t
22\t8223\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t2\t4\t3\t1\t0\t0\tTRUE\t0\t
23\t3083\t\tred\t0\t0\t0\t1\t0\tTRUE\t1\t4\t4\t4\t1\t0\t0\tFALSE\t0\t
23\t4338\t\tred\t0\t0\t0\t2\t0\tTRUE\t3\t1\t4\t0\t2\t0\t0\tTRUE\t0\t
23\t5654\t\tred\t0\t0\t0\t0\t0\tTRUE\t5\t1\t1\t2\t0\t0\t0\tTRUE\t0\t
23\t5715\t\tred\t0\t0\t0\t0\t0\tTRUE\t0\t0\t2\t6\t3\t0\t1\tFALSE\t0\t
23\t6104\t\tred\t0\t0\t0\t0\t0\tTRUE\t2\t2\t0\t4\t0\t0\t0\tFALSE\t0\t
23\t6738\t\tred\t0\t0\t0\t2\t0\tTRUE\t0\t0\t0\t1\t1\t0\t0\tFALSE\t0\t
24\t1574\t\tred\t0\t0\t0\t3\t0\tTRUE\t1\t3\t3\t5\t2\t0\t1\tTRUE\t0\t
24\t4416\t\tred\t2\t0\t0\t0\t0\tTRUE\t3\t0\t0\t0\t4\t2\t0\tFALSE\t0\t
24\t5635\t\tred\t0\t0\t0\t0\t0\tFALSE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t0\t
24\t6740\t\tred\t0\t0\t0\t0\t0\tTRUE\t4\t2\t2\t4\t2\t0\t0\tFALSE\t0\t
24\t7845\t\tred\t0\t2\t0\t0\t0\tTRUE\t0\t1\t7\t0\t3\t0\t0\tTRUE\t0\t
25\t1577\t\tred\t0\t0\t0\t1\t2\tTRUE\t2\t4\t7\t0\t0\t0\t2\tTRUE\t0\t
25\t3388\t\tred\t0\t0\t2\t0\t0\tTRUE\t0\t0\t0\t0\t2\t2\t0\tFALSE\t0\t
25\t4320\t\tred\t0\t0\t0\t1\t0\tTRUE\t0\t0\t1\t2\t2\t2\t0\tFALSE\t0\t
25\t5990\t\tred\t0\t0\t0\t3\t0\tTRUE\t3\t3\t6\t6\t2\t0\t2\tFALSE\t0\t
25\t8175\t\tred\t0\t0\t1\t0\t1\tTRUE\t1\t5\t4\t0\t1\t0\t0\tFALSE\t0\t
26\t1690\t\tred\t0\t0\t0\t4\t0\tTRUE\t6\t8\t7\t3\t3\t0\t2\tTRUE\t0\t
26\t1942\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t6\t4\t3\t2\t0\t0\tTRUE\t0\t
26\t2231\t\tred\t0\t0\t0\t3\t0\tTRUE\t0\t0\t3\t1\t6\t4\t0\tTRUE\t0\t
26\t5554\t\tred\t0\t0\t0\t2\t0\tTRUE\t1\t0\t1\t0\t2\t2\t0\tFALSE\t0\t
26\t9738\t\tred\t0\t0\t0\t0\t0\tFALSE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t2\t
26\t9740\t\tred\t0\t0\t0\t0\t0\tFALSE\t0\t0\t0\t0\t0\t0\t0\tFALSE\t3\t`;

const uploadData = async () => {
    const rows = tsvData.trim().split('\n');
    const headers = rows[0].split('\t');

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split('\t');
        const entry = Object.fromEntries(
            headers.map((h, idx) => {
                const raw = values[idx];
                if (raw === undefined || raw === '') {
                    return [h, null]; // or '' if you prefer an empty string
                }
                const num = Number(raw);
                return [h, isNaN(num) ? raw : num];
            })
        );

        const nodeName = `M${entry.Match}T${entry.Team}`;
        const dataRef = ref(database, `scoutingData/${nodeName}`);

        try {
            await set(dataRef, entry);
            console.log(`✅ Uploaded ${nodeName}`);
        } catch (err) {
            console.error(`❌ Failed to upload ${nodeName}:`, err);
        }
    }
};

uploadData();
