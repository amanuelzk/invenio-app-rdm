import React, { useState,useEffect } from "react";
import { Dropdown, Modal, Header, Button } from "semantic-ui-react";
import {http} from "react-invenio-forms"
import _ from 'lodash'
import { i18next } from "@translations/invenio_app_rdm/i18next";

export const Stumble = () => {
  window.sendToReactComponent = (selectedValue) => {
    handleOptionChange(selectedValue)
    console.log('Selected value in React:', selectedValue);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState( [] );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const processResponse = (response) => {
    if (response && response.hits) {
      const hitsArray = response.hits.hits;
      setData(hitsArray)
      for (const hit of hitsArray) {
        const id = hit.id;
        const title = hit.metadata.title;
        console.log(`ID: ${id}, Title: ${title}`);
      }
    } else {
      console.error("No 'hits' property found in the response");
    }
  };

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await http.get(url, {
        headers: {
          Accept: "application/vnd.inveniordm.v1+json",
        },
      });
      const responseData = response.data;
     
      processResponse(responseData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleOptionChange = async (value) => {
    setSelectedOption(value);

  
    if (value === "publication") {
      await fetchData('  https://127.0.0.1:5000/api/records?q=&sort=newest&page=1&size=10&resource_type=publication');
      const shuffle = _.shuffle(data.map(obj => obj.id));
      window.location = `/records/${shuffle[0]}`;
    } else if (value === "Audio/Video") {
      await fetchData('https://127.0.0.1:5000/api/records?q=&sort=newest&page=1&size=10&resource_type=video');
      const shuffle = _.shuffle(data.map(obj => obj.id));
      window.location = `/records/${shuffle[0]}`;
    } else {
      await fetchData('https://127.0.0.1:5000/api/records?q=&sort=newest&page=1&size=10');
      const shuffle = _.shuffle(data.map(obj => obj.id));
      window.location = `/records/${shuffle[0]}`;
    }
  };

  return (
    <div>
      <section className="content1 cid-rVMdmjU4Mx" style={{backgroundImage: 'url(static/images/gresis-patter-3.jpg)', backgroundSize: 'contain', backgroundRepeatX: 'repeat', backgroundBlendMode: 'darken', backgroundColor: '#b55e2e', backgroundAttachment: 'fixed',  marginLeft: '-17%', width: '185%', paddingBottom: '30%', }}>
        <div className="container" style={{padding: 30}}>
          <div className="row justify-content-end">
            <div className="title__block col-lg-12">
              <h3 className="gresis-section-title gresis-fonts-style display-2" style={{color: '#eee', padding: 30}}>Stumble<span className="verline" /></h3>
              <h4 style={{color: '#eee', padding: '30px 20px', textAlign: 'center'}}>
                {i18next.t("The stumble, like a serendipitous wanderer, unveils treasures unforeseen, guiding the seeker to unexpected realms of wisdom, much like a researcher stumbling upon a hidden gem in the library of knowledge.")}<p />            
              </h4></div>
          </div>
          <Dropdown
              placeholder={i18next.t("Stumble!")}
              fluid
              selection
              options={[
                { key: "publication", text: "Publication", value: "publication" },
                { key: "audioVideo", text: "Audio/Video", value: "Audio/Video" },
                { key: "all", text: "Full Stumble", value: "all" },
                
              ]}

              value={selectedOption}
              onChange={handleOptionChange}
            />
          <span className="msg" />
        </div>
      </section>
    </div>
  );
};
