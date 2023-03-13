/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import { Segment, Header } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function AdminPanel() {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function getOwner() {
      if (artifact) {
        console.log("AdminPanel : Smartcontract trouvé");
        // On check si l'account courant est l'owner du contract
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("AdminPanel : Smartcontract non détecté");
        //alert("PAs de contrat trouvé");
      }
    }

    getOwner();
  }, [accounts, contract, artifact]);

  return (
    isOwner && (
      <Segment raised size="huge" color="blue">
        <Header as="h2">Admin's panel</Header>
      </Segment>
    )
  );
}

export default AdminPanel;
