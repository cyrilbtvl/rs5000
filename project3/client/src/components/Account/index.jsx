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
        console.log("Account : user connected");
        // On check si l'account courant est l'owner du contract
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("Account : user not connected");
        //alert("pas de contract détecté");
      }
    };

    async function getVoter() {
      if (artifact) {
        console.log("Account : user connected");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isVoter = allVoterAddress.includes(accounts[0]);
          console.log("Account : isVoter ? " + isVoter);
          if (isVoter) {
            setIsVoter(true);
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("Account : HasVoter ? " + voterData.hasVoted);
          } else {
            setIsVoter(false);
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log("Account : user not connected");
      }
    }

    getAccount();
    getOwner();
    getVoter();

  }, [accounts, contract, artifact]);

  return (
    !artifact ? (
      <Message icon='user times' color='red' header='Dear user' content="You are not connected" />
    ) :
      isOwner ? (
        <Message icon='user secret' color='blue' header='Dear owner, you are connected with this address' content={account} />
      ) :
        isVoter ? (
          <Message icon='user' color='green' header='Dear voter, you are connected with this address' content={account} />
        ) : (
          <Message icon color='orange'>
            <Icon name='user outline' />
            <Message.List>
              <Message.Item>Dear user, you are not a voter.</Message.Item>
              <Message.Item>You are connected with this address : {account}</Message.Item>
            </Message.List>
          </Message >
        )

  );
}

export default Account;
