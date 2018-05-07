import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class SearchListView extends Component {
  geturlCategory() {
    const { category, ids, _id } = this.props.result;
    let url = '';

    if (category === 'unit') {
      url = `/contents/${_id}?ref=home`;
    } else if (category === 'topic') {
      const { unitId } = ids;

      url = `/contents/${unitId}?rs=${_id}`;
    } else if (category === 'resource' && ids !== undefined) {
      const { topicId } = ids;
      url = `/view_resource/${topicId}?rs=${_id}`;
    } else if (category === 'reference') {
      url = `/extra/view_resource/extra?rs=${_id}`;
    } else if (category === 'course') {
      const { courseId } = ids;
      url = `/course_content/${courseId}?ref=home`;
    } else if (category === 'subject') {
      const { courseId } = ids;
      url = `/contents/${courseId}?ref=home`;
    }

    return url;
  }

  render() {
    return (
      <tr>
        <td>
          [{this.props.result.category.toUpperCase()}]{' '}
          <a className="results" href={this.geturlCategory()}>
            {this.props.result.name}
          </a>
        </td>
      </tr>
    );
  }
}

SearchListView.propTypes = {
  result: PropTypes.object.isRequired,
};
