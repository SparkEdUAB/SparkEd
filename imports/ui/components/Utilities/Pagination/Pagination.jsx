import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export default class Pagination extends Component {
  lastPage(number) {
    return (
      <li className="waves-effect">
        <a
          href={`${this.props.path + this.props.query}&p=${number}`}
          className="fa fa-angle-right "
        />
      </li>
    );
  }

  firstPage() {
    return (
      <li className="disabled">
        <a href={`${this.props.path + this.props.query}&p=1`} className="fa fa-angle-left " />
      </li>
    );
  }
  /* paginate controls the behaviour of page links

**/
  paginate(event) {
    //  event.PreventDefault;
    let links = $('.page');

    $.each(links, function(k, v) {
      $(this).removeClass('active');
    });

    $(links[Math.floor(getPage() - 1)]).addClass('active');
    const url = $(this).attr('href');
  }

  displayPagination() {
    let total = this.props.totalResults;
    let itemPerPage = this.props.itemPerPage;
    let pages = Math.floor(total / itemPerPage);
    if (pages < 1) {
      // no pages to  paginate
      return null;
    }

    let links = [];

    for (let i = 0; i < pages; i++) {
      let active = '';
      let page = getPage() - 1;
      if (page == i) {
        active = 'active blue';
      } else if (getPage() < 1 && i == 0) {
        active = 'active blue';
      }

      links.push(
        <li onClick={this.paginate.bind(this)} className={'page ' + active} key={Math.random()}>
          <a href={`${this.props.path + this.props.query}&p=${i + 1}`}>{i + 1}</a>
        </li>,
      );
    }
    return links;
  }

  render() {
    let total = this.props.totalResults;
    var itemPerPage = this.props.itemPerPage;

    if (total <= 1 || total == itemPerPage || total < itemPerPage) {
      return null;
    }

    let lastPage = Math.floor(this.props.totalResults / this.props.itemPerPage + 1);
    return (
      <div className="resultPage">
        <ul className="pagination ">
          {this.firstPage()}
          {this.displayPagination()}
          {this.lastPage(lastPage)}
        </ul>
      </div>
    );
  }
}

export function getPage() {
  let page = FlowRouter.getQueryParam('p');
  if (page == undefined || isNaN(page)) {
    return 0;
  }
  return Math.floor(parseInt(page));
}
/** *
validate page number
*/
export function validatePageNum(page) {
  if (page < 1) {
    return 0;
  }
  return Math.floor(page);
}

export function getPageNumber(itemPerPage) {
  const page = validatePageNum(getPage());
  if (page == 0) {
    return page;
  }
  return Math.floor(itemPerPage * (page - 1));
}

/** *
@param queryParams array of query object e.g [param:"name"]
@param getParam if true returns values for query params
@param isRegExp if true values are returned in RegExp format
@param isRegExp if true returns the value of getOne param

*/

export function getQuery(queryParams, getParam, isRegExp, getOne) {
  let query = '?';
  let count = 0;
  let join = '';
  let values = [];

  queryParams.forEach((queryParam, k, arra) => {
    let param = queryParam.param;

    let value = getParam == true ? FlowRouter.getQueryParam(param) : queryParam.value;

    if (value == undefined || value == '') {
      //if FlowRouter return undefined
      values[param] = '';
    } else {
      join = count == 0 ? '' : '&';
      query = query + param + '=' + value + join;
      values[param] = new RegExp(value, 'i');
    }
  });

  if (isRegExp && getOne) {
    return values[getOne];
  } else if (isRegExp) {
    return values;
  }
  return query;
}

Pagination.propTypes = {
  totalResults: PropTypes.number.isRequired,
  itemPerPage: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired, // to be changed to string111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110
  path: PropTypes.string.isRequired,
};
