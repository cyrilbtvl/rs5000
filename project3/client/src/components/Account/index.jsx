import { useState, useEffect } from "react";
import { Message, Icon } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function Account() {
  const { state: { accounts, contract, artifact }, } = useEth(); //????
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(false);

  useEffect(() => {
    async function getAccount() {
      if (accounts) {
        setAccount(accounts[0]);
      }
    };
    async function getOwner() {
      if (artifact) {
        console.log("Account : Smartcontract trouvé");
        // On check si l'account courant est l'owner du contract
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("Account : Smartcontract non détecté");
        //alert("pas de contract détecté");
      }
    };

    async function getVoter() {
      if (artifact) {
        console.log("VoterPanel : Smartcontract trouvé");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isVoter = allVoterAddress.includes(accounts[0]);
          console.log("isVoter ? " + isVoter);
          if (isVoter) {
            setIsVoter(true);
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("HasVoter ? " + voterData.hasVoted);
          } else {
            setIsVoter(false);
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    }

    getAccount();
    getOwner();
    getVoter();

  }, [accounts, contract, artifact]);

  return (
    !artifact ? (
      <Message icon color='red'>
        <Icon name='warning circle' />
        <Message.Header>Service Indisponible</Message.Header>
        <Message.List>
          <Message.Item>Merci de redéployer votre contrat sur la bonne blockchain.</Message.Item>
          <Message.Item>Vous êtes connecté avec l'adresse : {account}</Message.Item>
        </Message.List>
      </Message>
    ) :
      isOwner ? (
        <Message icon='user secret' color='blue' header='Dear owner, you are connected with this address' content={account} />
      ) :
        isVoter ? (
          <Message icon='user' color='green' header='Dear voter, you are connected with this address' content={account} />
        ) : (
          <Message icon color='orange'>
            <Icon name='user times' />
            <Message.List>
              <Message.Item>Dear user, you are not a voter.</Message.Item>
              <Message.Item>You are connected with this address : {account}</Message.Item>
            </Message.List>
          </Message >
        )

  );
}

export default Account;
