(function () {
    "use strict";

    function getCurrentFile() {
        var path = window.location.pathname || "";
        var parts = path.split("/");
        var file = parts.pop() || parts.pop();
        if (!file) {
            return "index.html";
        }
        return file;
    }

    function setActiveNav() {
        var header = document.getElementById("site-header");
        if (!header) {
            return;
        }

        var currentFile = getCurrentFile();
        var navLinks = header.querySelectorAll(".navbar-nav .nav-link");
        navLinks.forEach(function (link) {
            link.classList.remove("active");
        });

        var activeLink = header.querySelector('.navbar-nav .nav-link[href="' + currentFile + '"]');
        if (activeLink) {
            activeLink.classList.add("active");
        }

        var dropdownItem = header.querySelector('.dropdown-menu .dropdown-item[href="' + currentFile + '"]');
        if (dropdownItem) {
            dropdownItem.classList.add("active");
            var dropdownToggle = header.querySelector('.nav-link.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add("active");
            }
        }
    }

    function fetchInto(url, element, afterInsert) {
        if (!element) {
            return Promise.resolve();
        }

        return fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Failed to load " + url);
                }
                return response.text();
            })
            .then(function (html) {
                element.innerHTML = html;
                if (typeof afterInsert === "function") {
                    afterInsert();
                }
            })
            .catch(function () {
                // Fail silently to avoid breaking the page if includes are missing.
            });
    }

    document.addEventListener("DOMContentLoaded", function () {
        var headerEl = document.getElementById("site-header");
        var footerEl = document.getElementById("site-footer");

        Promise.all([
            fetchInto("partials/header.html", headerEl, setActiveNav),
            fetchInto("partials/footer.html", footerEl)
        ]).then(function () {
            if (window.WOW) {
                new WOW().init();
            }
        });
    });
})();
