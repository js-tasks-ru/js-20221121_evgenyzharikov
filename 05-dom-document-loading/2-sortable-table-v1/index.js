import {template} from "@babel/core";

export default class SortableTable {

  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
              </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getTableBody() {
    return `
    <div data-element="body" class="sortable-table__body">
    ${this.getTableRows(this.data)}
    </div>
    `;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `
    <a href="/products/${item.id}" class="sortable-table__row">
      ${this.getTableRow(item)}
      </a>
    `;
    });

  }

  getTableRow(el) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cells.map(({id, template}) => {
      return template ? template(el[id]) : `<div class="sortable-table__cell">${el[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
    <div class="sortable-table">
    ${this.getTableHeader()}
    ${this.getTableBody()}
    `;
  }

  render () {
    const container = document.createElement('div');
    container.innerHTML = this.getTable();
    const element = container.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allCol = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const curCol = this.element.querySelector('.sortable-table__cell[data-id=${field}]');
    allCol.forEach(col => {
      col.dataset.oreder = '';
    });

    curCol.dataset.oreder = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const col = this.headerConfig.find(item => item.id === field);
    const {sortType} = col;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number': return direction * (a[field] - b[field]);
      case 'string': return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      default:
        throw new Error(`Invalid sort type - ${sortType}`);
      }
    });

  }

  getSubElements(element) {
    const res = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;

      res[name] = subElement;
    }

    return res;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

