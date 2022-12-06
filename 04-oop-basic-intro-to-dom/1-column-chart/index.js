export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  get template () {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
            ${this.value}
            </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `
  }

  getSubElements () {
    const result = {};
    const elements = this.element_chart.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  render () {
    const container = document.createElement('div');

    container.innerHTML = this.template;

    this.element_chart = container.firstElementChild;

    if (this.data.length) {
      this.element_chart.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements();
  }

  getColumnBody () {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(
        item * scale
      )}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  getLink () {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  update(data = []) {
    if (!this.data.length) {
      this.element_chart.classList.add('column-chart_loading')
    }

    this.data = data;

    this.subElements.body.innerHTML = this.getColumnBody();
  }

  remove () {
    if (this.element_chart) {
      this.element_chart.remove();
    }
  }

  destroy() {
    this.remove();
    this.element_chart = {};
    this.subElements = {};
  }

}
