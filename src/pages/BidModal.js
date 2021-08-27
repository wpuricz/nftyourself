import { useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { getWethBalance } from "../utils/Wallet";
import * as Sea from "../services/Sea";
import "../styles/modal.css";

const BidModal = (props) => {
  const {
    handleClose,
    show,
    price,
    name,
    assetContractAddress,
    tokenId,
    schema,
  } = props;
  const [bid, setBid] = useState();
  const [screenId, setScreenId] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Screen = {
    BID: 0,
    UNISWAP: 1,
  };

  const bidPressed = async () => {
    if (screenId === Screen.BID) {
      if (isNaN(bid)) {
        setErrorMessage("Please enter a valid bid");
        return;
      }
      const wethBalance = await getWethBalance();
      console.log("weth bal:" + wethBalance);
      if (wethBalance < bid) {
        setScreenId(Screen.UNISWAP); // detect here if we should show the uniswap screen
      } else {
        await placeBidOnOpensea();
      }
    } else {
      // screen === UNISWAP
      await placeBidOnOpensea();
    }
  };

  const placeBidOnOpensea = async () => {
    setErrorMessage("");
    console.log(
      `bid:${bid}, schema:${schema}, contract:${assetContractAddress}, token:${tokenId}`
    );
    try {
      setIsLoading(true);
      await Sea.placeBid(bid, schema, assetContractAddress, tokenId);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error);
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setScreenId(Screen.BID);
    handleClose();
    setErrorMessage(false);
    setIsSuccess(false);
  };

  const errorView = () => {
    return <div className="errorLabel">{errorMessage.message}</div>;
  };

  const successView = () => {
    return (
      <div className="successLabel">
        Your bid has been successfully placed!{" "}
        <Button variant="primary" size="sm" onClick={() => closeModal()}>
          Close
        </Button>
      </div>
    );
  };

  const formComponent = () => {
    return (
      <div>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Bid Price</Form.Label>
            <Form.Control
              type="text"
              placeholder={price}
              value={bid}
              onChange={(e) => setBid(e.target.value)}
            />
            <Form.Text className="text-muted">Enter bid for {name}</Form.Text>
          </Form.Group>
        </Form>
        {errorMessage ? errorView() : ""}
        {isSuccess ? successView() : ""}
      </div>
    );
  };

  const uniswapComponent = () => {
    return (
      <iframe
        title="uniswap"
        src={`https://app.uniswap.org/#/swap?outputCurrency=0xc778417E063141139Fce010982780140Aa0cD5Ab&inputCurrency=ETH&exactAmount=${bid}`}
        height="660px"
        width="100%"
        style={{ borderRadius: 10 }}
        id="myId"
      />
    );
  };

  return (
    <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>
          {screenId === Screen.BID ? (
            "Place Bid"
          ) : (
            <span>
              <Button variant="link" onClick={() => setScreenId(Screen.BID)}>
                Back
              </Button>
              Convert ETH to WETH{" "}
            </span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {screenId === Screen.BID ? formComponent() : uniswapComponent()}
      </Modal.Body>
      <Modal.Footer>
        {screenId === Screen.BID ? (
          <span className="bid-footer">
            <Spinner animation={isLoading ? "border" : "none"} />
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={bidPressed} disabled={isLoading}>
              Place Bid
            </Button>
          </span>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BidModal;
