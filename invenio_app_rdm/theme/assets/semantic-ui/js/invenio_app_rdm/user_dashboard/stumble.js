import React, { useState,useEffect } from "react";
import { Dropdown, Modal, Header, Button } from "semantic-ui-react";
import {http} from "react-invenio-forms"
import _ from 'lodash'
import { i18next } from "@translations/invenio_app_rdm/i18next";
import ReactDOM from "react-dom"
export const StumbleItem = (result) => {
  console.log(result.result)
  const [selectedOption, setSelectedOption] = useState(null);
  const friendOptions = [
    {
      key: "publication",
      text: "Publication",
      value: "publication",
    },
    {
      key: "Audio/Video",
      text: "Audio/Video",
      value: "Audio/Video",
    },
    {
      key: "all",
      text: "Full Stumble",
      value: "all",
    },
  ];



  const handleOptionChange = (event, { value }) => {
    console.log(value)
       setSelectedOption(value);
       if(value==="publication"){
        const publicationLinks = result.result.filter(obj => {
          const resourceType = obj.metadata.resource_type.id;
          return (
            resourceType.includes("publication") ||
            resourceType.split('-').includes("publication")
          );
        })
        .map(obj => obj.id);
        let shuffle =   _.shuffle(publicationLinks)
        console.log(shuffle)
        window.location = `/records/${shuffle[0]}  `;
        }else if(value==="Audio/Video"){
          const publicationLinks = result.result.filter(obj => obj.metadata.resource_type.id === "video")
          .map(obj => obj.id);;
            let shuffle= _.shuffle(publicationLinks)

            window.location = `/records/${shuffle[0]}  `;
        }else{
          const publicationLinks = result.result
            .map(obj => obj.id);
           let shuffle= _.shuffle(publicationLinks)
            window.location = `/records/${shuffle[0]}  `;
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
              options={friendOptions}

              value={selectedOption}
              onChange={handleOptionChange}
            />
          <span className="msg" />
        </div>
      </section>
    </div>
  );
}



export const Stumble = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState({ hits: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const friendOptions = [
    {
      key: "publication",
      text: "Publication",
      value: "publication",
    },
    {
      key: "Audio/Video",
      text: "Audio/Video",
      value: "Audio/Video",
    },
    {
      key: "all",
      text: "Full Stumble",
      value: "all",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await http.get("/api/records?sort=newest&size=20", {
        headers: {
          Accept: "application/vnd.inveniordm.v1+json",
        },
      });
      setData(response.data);
      console.log(response)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleOptionChange = (event, { value }) => {
    console.log(value)
    
 
       setSelectedOption(value);
       
       if(value==="publication"){
        const publicationLinks = data.hits.hits.filter(obj => {
          const resourceType = obj.metadata.resource_type.id;
          return (
            resourceType.includes("publication") ||
            resourceType.split('-').includes("publication")
          );
        })
        .map(obj => obj.id);
        let shuffle =   _.shuffle(publicationLinks)
        console.log(shuffle)
        window.location = `/records/${shuffle[0]}  `;
        }else if(value==="Audio/Video"){
          const publicationLinks = data.hits.hits.filter(obj => obj.metadata.resource_type.id === "video")
          .map(obj => obj.id);;
            let shuffle= _.shuffle(publicationLinks)

            window.location = `/records/${shuffle[0]}  `;
        }else{
          const publicationLinks = data.hits.hits
            .map(obj => obj.id);
           let shuffle= _.shuffle(publicationLinks)
            window.location = `/records/${shuffle[0]}  `;
        }
  };

 
  return (
    <div>
     
          <Dropdown
              placeholder={i18next.t("Stumble!")}
              fluid
              selection
              options={friendOptions}
              value={selectedOption}
              onChange={handleOptionChange}
            />
         
    </div>
  );
}
ReactDOM.render(
  <Stumble />,
  document.getElementById("react-stumbleNav")
);
