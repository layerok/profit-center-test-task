import {
  cloneElement,
  CSSProperties,
  ReactElement,
  ReactNode,
  useId,
  useState,
} from "react";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingNode,
  FloatingTree,
  useFloatingNodeId,
  FloatingOverlay,
  useFloatingParentNodeId,
} from "@floating-ui/react-dom-interactions";

export type IBaseModalProps = {
  open?: boolean;
  children: ReactElement;
  overlayStyles: CSSProperties;
  render: (props: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => ReactNode;
  useClickOptions?: {
    enabled?: boolean;
    pointerDown?: boolean;
    toggle?: boolean;
    ignoreMouse?: boolean;
  };
  onOpenChange: (state: boolean) => void;
};

export const BaseModalComponent = ({
  render,
  overlayStyles,
  open: passedOpen = false,
  children,
  useClickOptions = {},
  onOpenChange,
}: IBaseModalProps) => {
  const [open, setOpen] = useState(passedOpen);
  const [allowDismiss] = useState(true);
  const nodeId = useFloatingNodeId();

  const { reference, floating, context, refs } = useFloating({
    open,
    onOpenChange: (state) => {
      onOpenChange?.(state);
      setOpen(state);
    },
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, useClickOptions),
    useRole(context),
    useDismiss(context, {
      enabled: allowDismiss,
    }),
  ]);

  const close = () => setOpen(false);

  return (
    <FloatingNode id={nodeId}>
      <div style={{ cursor: "pointer", display: "flex" }}>
        {cloneElement(
          children,
          getReferenceProps({ ref: reference, ...children.props })
        )}
      </div>
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll style={{ ...overlayStyles }}>
            <div
              {...getFloatingProps({
                ref: floating,
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              {render({
                close,
                labelId,
                descriptionId,
              })}
            </div>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
};

export const BaseModal = (props: IBaseModalProps) => {
  const parentId = useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <FloatingTree>
        <BaseModalComponent {...props} />
      </FloatingTree>
    );
  }

  return <BaseModalComponent {...props} />;
};
