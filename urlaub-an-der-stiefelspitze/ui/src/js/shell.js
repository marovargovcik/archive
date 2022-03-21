import { init as initTable } from "./table/init";

// Web
$.fancybox.defaults.hash = false;

// Admin
if ($("body").data("branch") === "admin") {
    // Listen for sidebar trigger click
    $("[data-toggle=sidebar]").click(() => {
        $("[data-sidebar]").toggleClass("sidebar--active");
    });

    // Init tables if any
    if (window.tables) {
        for (const table of window.tables) {
            initTable(table);
        }
    }

    // Load external form in modal
    const modal = $("#modal");
    $(modal).on("show.bs.modal", function (e) {
        if (e.target.classList.contains('link-dialog')) {
            return;
        }

        // Set title
        if (e.relatedTarget.dataset.title) {
            $(this).find("[data-title]").text(e.relatedTarget.dataset.title);
        }

        // Set action button url
        $(this).find("[data-form]").attr("action", e.relatedTarget.href);

        // Load external form
        $(this)
            .find("[data-load-target]")
            .load(e.relatedTarget.href, () => {
                // Hide loading spinner
                $(this).find("[data-spinner]").hide();

                // After load check if there is wysiwyg editor - initialize if yes
                $(this)
                    .find("[data-wysiwyg]")
                    .summernote({
                        dialogsInBody: true,
                        fontSizes: [
                            8,
                            9,
                            10,
                            11,
                            12,
                            14,
                            16,
                            18,
                            20,
                            24,
                            36,
                            48,
                        ],
                        toolbar: [
                            [
                                "common",
                                [
                                    "style",
                                    "fontsize",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strikethrough",
                                    "clear",
                                    "ol",
                                    "ul",
                                    "paragraph",
                                    "link",
                                    "hr",
                                    "table",
                                    "codeview",
                                    "fullscreen",
                                ],
                            ],
                        ],
                    });
            });
    });

    // Remove previously loaded form and show spinner again
    $(modal).on("hidden.bs.modal", function (e) {
        if (e.target.classList.contains('link-dialog')) {
            return;
        }
        $(this).find("[data-spinner]").show();
        $(this).find("[data-load-target]").empty();
    });
}
