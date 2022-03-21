import Tabulator from "tabulator-tables";
import { config as pagesConfig } from "./configs/pages";

function init(props) {
    const table = document
        .getElementById(props.selector)
        .querySelector("table");

    let config = {};
    switch (props.type) {
        case "pages": {
            config = pagesConfig();
            break;
        }
    }

    const instance = new Tabulator(table, config);
    instance.setData(props.data);
}

export { init };
