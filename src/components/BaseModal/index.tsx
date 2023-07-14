import {
  cloneElement,
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
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
  useFloatingTree,
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
};

export const BaseModalComponent = ({
  render,
  overlayStyles,
  open: passedOpen = false,
  children,
  useClickOptions = {},
}: IBaseModalProps) => {
  const [open, setOpen] = useState(passedOpen);
  const [allowDismiss, setAllowDismiss] = useState(true);
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();

  const { reference, floating, context, refs } = useFloating({
    open,
    onOpenChange: setOpen,
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

  const tree = useFloatingTree();

  useEffect(() => {
    function onTreeOpenChange({
      open,
      reference,
      parentId: dataParentId,
      nodeId: dataNodeId,
    }) {
      if (nodeId === dataParentId) {
        // если открылка дочерний модал, то запрещаем закрывать родительский пока не закрыли дочерний
        setAllowDismiss(!open);
      }
    }

    tree?.events.on("openChange", onTreeOpenChange);

    return () => {
      tree?.events.off("openChange", onTreeOpenChange);
    };
  }, [nodeId, open, parentId, tree, refs.reference]);

  useEffect(() => {
    tree?.events.emit("openChange", {
      open,
      parentId,
      nodeId,
      reference: refs.reference.current,
    });
  }, [nodeId, parentId, tree, open, refs.reference]);

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
