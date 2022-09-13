import { Button, ButtonGroup, FocusView } from "@stripe/ui-extension-sdk/ui";
import BaseView from "../components/BaseView";
import CheckoutView from "../components/CheckoutFocusView";

import { useState } from "react";

const terminalDevices = [
  {
    id: "tmr_EwteKwift98Qst",
    label: "Simulated BBPOS WisePOS E",
    status: "online",
  },
];

const confirmCloseMessages = {
  title: "Cancel checkout",
  description:
    "Are you sure you want to cancel? This will clear the cart or manually entered amount.",
  cancelAction: "Go back",
  exitAction: "Cancel",
};

const HomeView = () => {
  const [shown, setShown] = useState<boolean>(false);
  const [confirmClose, setConfirmClose] = useState<boolean>(false);
  const [amount, setAmount] = useState(0);

  const open = () => {
    setConfirmClose(true);
    setShown(true);
  };

  const closeWithConfirm = () => {
    setShown(false);
  };

  const closeWithoutConfirm = () => {
    setConfirmClose(false);
    setShown(false);
  };

  const chargeAmount = () => {
    closeWithoutConfirm();
  };

  return (
    <BaseView
      title="Collect a payment"
      description="Complete an in-person order"
      actions={
        <Button onPress={open} type="primary" css={{ width: "fill" }}>
          Checkout
        </Button>
      }
    >
      <FocusView
        title="Checkout"
        shown={shown}
        setShown={setShown}
        confirmCloseMessages={confirmClose ? confirmCloseMessages : undefined}
        secondaryAction={
          <Button onPress={closeWithConfirm} type="destructive">
            Cancel
          </Button>
        }
        footerContent={
          <ButtonGroup key={amount <= 99}>
            <Button
              disabled={amount <= 99 || !amount}
              type="primary"
              onPress={chargeAmount}
            >
              Charge
            </Button>
            <Button>Display Cart</Button>
          </ButtonGroup>
        }
      >
        <CheckoutView amount={amount} setAmount={setAmount} />
      </FocusView>
    </BaseView>
  );
};

export default HomeView;
