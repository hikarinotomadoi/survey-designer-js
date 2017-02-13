import React, { Component } from 'react';
import * as Utils from '../../../utils';
import TransformQuestion from './TransformQuestion';

export default class ItemBase extends TransformQuestion {
  handleCheckboxChange(e) {
    const { model } = this.state;
    const itemIndex = parseInt(e.target.dataset.responseItemIndex, 10);
    this.setState({ model: model.setItemState(itemIndex, e.target.checked) });
  }

  makeItems(containerId) {
    const { question } = this.props;
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      return Utils.errorMessage('items attribute is not defined');
    }
    return items.map(item => (
      <Item
        key={`${question.getId()}_${item.getIndex()}`}
        containerId={containerId}
        question={question}
        inputType={this.inputType}
        item={item}
        itemState={model.getItemStateByItemIndex(item.getIndex())}
        handleCheckboxChange={e => this.handleCheckboxChange(e)}
      />
    ));
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    const containerId = `${question.getId()}-ul-container`;
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(description, answers) }} />
        <div className="question">
          <ul id={containerId} className="checkbox validation-hover-target">
            {this.makeItems(containerId)}
          </ul>
        </div>
      </div>
    );
  }
}

class Item extends Component {
  renderInput(question, item, itemState) {
    let type;
    if (item.hasTextInput()) type = 'text';
    else if (item.hasNumberInput()) type = 'number';
    else return null;
    const disabled = !itemState.get('checked');
    const name = `${question.getId()}_value${item.getIndex() + 1}_text`;
    return (
      <input
        type={type}
        name={name}
        data-response-key="freeText"
        data-response-multiple={type === 'checkbox'}
        data-response-item-index={item.getIndex()}
        data-parsley-required
        data-parsley-type={type === 'number' ? 'digits' : null}
        data-parsley-type-message="半角数字のみで入力してください"
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { containerId, itemState, inputType, item, question, handleCheckboxChange } = this.props;
    const label = item.getLabel();
    const unit = item.getUnit();
    const answers = {};
    const disabled = !!itemState.get('disabled');
    const className = `question-form-list ${disabled ? 'disabled' : ''}`;
    const name = inputType === 'checkbox' ? `${question.getId()}__value${item.getIndex() + 1}` : question.getId();
    const value = inputType === 'checkbox' ? 'on' : `value${item.getIndex() + 1}`;
    return (
      <li className={className}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type={inputType}
            name={name}
            value={value}
            checked={itemState.get('checked')}
            onChange={handleCheckboxChange}
            disabled={disabled}
            data-response-key="checked"
            data-response-multiple={inputType === 'checkbox'}
            data-response-item-index={item.getIndex()}
            data-parsley-class-handler={`#${containerId}`}
            data-parsley-required={question.getMinCheckCount() > 0}
            data-parsley-mincheck={question.getMinCheckCount() !== 0 ? question.getMinCheckCount() : null}
            data-parsley-maxcheck={question.getMaxCheckCount() !== 0 ? question.getMaxCheckCount() : null}
            data-parsley-multiple={question.getId()}
          />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(label, answers) }} />
          {this.renderInput(question, item, itemState)}
          <span dangerouslySetInnerHTML={{ __html: Utils.r(unit, answers) }} />
        </label>
      </li>
    );
  }
}