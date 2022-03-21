import { common, commonColumn } from "./common";

const config = () => {
    return {
        ...common,
        columns: [
            {
                title: "General",
                columns: [
                    {
                        ...commonColumn,
                        title: "Name",
                        field: "name",
                        width: "80%",
                    },
                ],
            },
            {
                title: "Translations",
                columns: window.languageCodes.map((languageCode) => {
                    return {
                        ...commonColumn,
                        headerFilter: false,
                        title: languageCode,
                        field: `translations.${languageCode}`,
                        width: 20 / window.languageCodes.length + "%",
                        headerSort: false,
                        formatter: (cell) => {
                            const translation = cell.getValue();
                            if (translation.exists) {
                                return `<a
                                          href='${translation.urls.edit}'
                                          class='button button--blue'>
                                          Edit
                                        </a>
                                        <a
                                          href='${translation.urls.show}'
                                          target="_blank"
                                          class='button button--blue'>
                                          Show
                                        </a>`;
                            }
                            return `<a
                                      href='${translation.urls.add}'
                                      data-title="New translation"
                                      data-toggle='modal'
                                      data-target='#modal'
                                      class='button button--blue'>
                                      Add
                                    </a>`;
                        },
                    };
                }),
            },
        ],
    };
};

export { config };
