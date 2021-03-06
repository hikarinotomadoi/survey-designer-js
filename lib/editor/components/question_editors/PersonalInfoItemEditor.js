/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import TinyMCE from 'react-tinymce';
import { Radio } from 'react-bootstrap';
import * as EditorActions from '../../actions';
import BaseItemEditor from './BaseItemEditor';
import { isDevelopment } from '../../../utils';

/** 個人情報設問のitemsを編集する際に使用するeditor */
export default class PersonalInfoItemEditor extends BaseItemEditor {
  createValueElement(content) {
    const { options } = this.props;
    if (this.state.tinymceVisible) {
      return (
        <TinyMCE
          className="item-editor-tinymce"
          config={{
            menubar: '',
            toolbar: `bold italic underline strikethrough backcolor forecolor anchor removeformat ${isDevelopment() ? 'code' : ''}`,
            plugins: `contextmenu textcolor paste link ${isDevelopment() ? 'code' : ''}`,
            forced_root_block: false,
            inline: true,
            statusbar: false,
            target_list: false,
            default_link_target: '_blank',
            verify_html: false, // trueだと要素や属性が削除されることがある
            imageManagerUrl: options.getImageManagerUrl(),
          }}
          onKeyup={(e, editorInstance) => this.debouncedHandleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          onChange={(e, editorInstance) => this.debouncedHandleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          onBlur={() => this.handleTinyMCEVisibleChange(false)}
          onInit={(e, editor) => this.handleTinyMCEInit(e, editor)}
          content={content}
        />
      );
    }
    return (
      <div
        className="html-editor"
        onClick={() => this.handleTinyMCEVisibleChange(true)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  getDisplayTypes(item, disabled) {
    return item.getDisplayTypeCandidates().map(displayType => <Radio
      key={`${item.getId()}_${displayType.getId()}`}
      checked={item.getDisplayTypeId() === displayType.getId()}
      title={displayType.getLabel()}
      onChange={() => this.handleChangeOption('displayTypeId', displayType.getId())}
      disabled={disabled}
      inline
    >
      {displayType.getLabel()}
    </Radio>);
  }

  /** 描画 */
  render() {
    const {
      item,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      dragging,
      disabled,
    } = this.props;
    const content = item.getLabel() || '';

    const editor = disabled ? (<input
      disabled={disabled}
      type="text"
      className="form-control plain-text-item"
      onChange={e => this.handleChangeItem(e.target.value)}
      value={content}
    />) : this.createValueElement(content);

    return connectDragPreview(connectDropTarget(
      <tr className={classNames('item-editor-row', { invisible: dragging })}>
        <td className="item-editor-dnd">{connectDragSource(<i className="fa fa-bars drag-handler" />)}</td>
        <td className="personal-item-editor-tinymce-container">
          {editor}
          <input type="hidden" className="item-id" value={item.getId()} />
        </td>
        <td className="personal-item-editor-optional-checkbox-td">
          <input type="checkbox" disabled={disabled} onChange={e => this.handleChangeOption('isOptional', e.target.checked)} checked={item.isOptional()} />
        </td>
        <td>
          {this.getDisplayTypes(item, disabled)}
        </td>
      </tr>,
    ));
  }
}

export const conditionSource = {
  beginDrag(props) {
    return {
      itemId: props.item.getId(),
    };
  },
};

export const conditionTarget = {
  hover(props, monitor, component) {
    const { survey, page, question, item } = props;
    const dragItemId = monitor.getItem().itemId;
    const hoverItemId = item.getId();

    // 自分自身の場合には何もしない
    if (dragItemId === hoverItemId) {
      return;
    }

    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const fireThresholdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    const dragNodeIndex = survey.findNodeIndex(dragItemId);
    const hoverNodeIndex = survey.findNodeIndex(hoverItemId);
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < fireThresholdY) {
      return;
    }

    // Dragging upwards
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > fireThresholdY) {
      return;
    }

    // Time to actually perform the action
    props.swapItem(page.getId(), question.getId(), dragItemId, hoverItemId);
  },
};

export const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
});
export const actionsToProps = dispatch => ({
  changeItemAttribute: (pageId, questionId, itemId, attribute, value) =>
    dispatch(EditorActions.changeItemAttribute(pageId, questionId, itemId, attribute, value)),
  swapItem: (pageId, questionId, srcItemId, destItemId) =>
    dispatch(EditorActions.swapItem(pageId, questionId, srcItemId, destItemId)),
});
