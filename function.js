class LoadMore extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.loadMoreItems);
    }

    loadMoreItems() {
        const loadMoreBtn = this.querySelector('[type="button"]');
        loadMoreBtn.setAttribute("disabled", true);
        loadMoreBtn.innerHTML = "Loading";
        let { currentPage, pageSize, nextUrl, totalItems, totalPages } = this.dataset
        let nextPage = parseInt(this.dataset.currentPage) + 1
        console.log(this.dataset);
        if (currentPage >= totalPages) return false;

        fetch(nextUrl.replace(/page=[0-9]+/, 'page=' + nextPage))
            .then(response => response.text())
            .then((responseText) => {
                const html = responseText;
                $('#product-grid').append($(html).find('#product-grid').html());
            }).catch((e) => {
                console.error(e);
            })
            .finally(() => {
                loadMoreBtn.removeAttribute("disabled");
                loadMoreBtn.innerHTML = "Load More";
                this.dataset.currentPage = parseInt(this.dataset.currentPage) + 1;

                let isLastPage = parseInt(totalItems) - (nextPage * parseInt(pageSize)) < 0
                this.querySelector('[load-items-count]').innerHTML = isLastPage ? parseInt(totalItems) : nextPage * parseInt(pageSize)
                isLastPage && loadMoreBtn.setAttribute('style', 'display:none');
            });
    }
}

customElements.define('load-more', LoadMore);