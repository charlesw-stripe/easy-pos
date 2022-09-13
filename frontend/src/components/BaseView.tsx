import { ContextView } from "@stripe/ui-extension-sdk/ui";
import { TITLE, BRAND_COLOR } from "../constants";

const BaseView = ({ ...contextViewProps }) => {
  return (
    <ContextView title={TITLE} brandColor={BRAND_COLOR} {...contextViewProps}>
      {contextViewProps.children}
    </ContextView>
  );
};

export default BaseView;
