// This file is part of InvenioRDM
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2021 New York University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { createSearchAppInit } from "@js/invenio_search_ui";
import {
  ContribBucketAggregationElement,
  ContribBucketAggregationValuesElement,
  ContribSearchAppFacets,
} from "@js/invenio_search_ui/components";

import { overrideStore, parametrize } from "react-overridable";
import { defaultContribComponents } from "@js/invenio_requests/contrib";
import isEmpty from "lodash/isEmpty";
import {
  MobileRequestItem,
  ComputerTabletRequestItem,
  RequestsSearchLayout,
  RequestsEmptyResultsWithState,
  RequestsResults,
} from "@js/invenio_requests/search";
import _get from "lodash/get";
import _truncate from "lodash/truncate";
import {
  Button,
  Item,
  Grid,
  Divider,
  Placeholder,
  Header,
  Message,
  Container,
  Label,
  Icon
} from "semantic-ui-react";
import ReactDOM from 'react-dom';

import _ from "lodash";
import React, { Component } from "react";
import { DashboardResultView, DashboardSearchLayoutHOC } from "./base";
import { withCancel, http } from "react-invenio-forms";
const appName = "InvenioAppRdm.DashboardSaved";

const fetch_url = "/api/records/saved";
export class SavedRecords extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      data: { hits: [] },
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.cancellableFetch && this.cancellableFetch.cancel();
  }

  fetchData = async () => {
    this.setState({ isLoading: true });

    this.cancellableFetch = withCancel(
      http.get(fetch_url, {
        headers: {
          Accept: "application/vnd.inveniordm.v1+json",
        },
      })
    );

    try {
      const response = await this.cancellableFetch.promise;
      
      this.setState({ data: response.data, isLoading: false });
    } catch (error) {

      console.error(error);
      this.setState({ error: error.response.data.message, isLoading: false });
    }
  };

  renderPlaceHolder = () => {
    // const { title } = this.props;

    return (
      <Container>
        <Header as="h2">{"check out saved records"}</Header>
        {Array.from(Array(10)).map((item, index) => (
          <div key={index}>
            <Placeholder fluid className="rel-mt-3">
              <Placeholder.Header>
                <Placeholder.Line />
              </Placeholder.Header>

              <Placeholder.Paragraph>
                <Placeholder.Line />
              </Placeholder.Paragraph>

              <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>

            {index < 9 && <Divider className="rel-mt-2 rel-mb-2" />}
          </div>
        ))}
      </Container>
    );
  };

  render() {
    const { title, appName } = this.props;
    const { isLoading, data, error } = this.state;
    const isPublished = true;
    const icon = isPublished ? (
      <Icon name="check" className="positive" />
    ) : (
      <Icon name="upload" className="negative" />
    );

    const listItems = data.hits?.map((result) => {
      return (
        <div>
          <br></br>
          
    <Item key={result.id} className="deposits-list-item computer tablet only flex">
      <div className="status-icon mr-10">
        <Item.Content verticalAlign="top">
          <Item.Extra>{icon}</Item.Extra>
        </Item.Content>
      </div>
      <Item.Content>
        <Item.Extra className="labels-actions">
          {/* {result.status in statuses && result.status !== "published" && (
            <Label size="tiny" className={statuses[result.status].color}>
              {statuses[result.status].title}
            </Label>
          )} */}
          <Label size="tiny" className="primary">
            {result.metadata.publication_date} 
          </Label>
          <Label size="tiny" className="neutral">
            {result.metadata.resource_type.id}
          </Label>
          
         
          {isPublished && (
            <Button
              compact
              size="small"
              floated="right"
              href={`/records/${result.id}`}
              labelPosition="left"
              icon="eye"
              content={i18next.t("View")}
            />
          )}
        </Item.Extra>
        <Item.Header as="h2">
          <a href={`/records/${result.id}`} className="truncate-lines-2">
            {result.metadata.title}
          </a>
        </Item.Header>
        <Item.Meta>
          <div className="creatibutors">
            {/* <SearchItemCreators creators={creators} /> */}
          </div>
        </Item.Meta>
        <Item.Description>
          {_truncate(result.metadata.description, {
            length: 350,
          })}
        </Item.Description>
       
      </Item.Content>
    </Item>
        </div>
      )
    });

    return (
      <>
      <Grid>
        <Grid.Column>
        <Header size='medium'>Check out saved records</Header>
          
        </Grid.Column>

       
      </Grid>
       
        
        {isLoading && this.renderPlaceHolder()}

        {!isLoading && !error && !isEmpty(listItems) && (
          <Container>
            {/* <Header as="h2">{"Empty"}</Header> */}

            <Item.Group relaxed link divided>
              {listItems}
            </Item.Group>

            

            {error && <Message content={error} error icon="warning sign" />}
          </Container>
        )}
      </>
    );
  }
}

ReactDOM.render(<SavedRecords />, document.getElementById('react-root'));