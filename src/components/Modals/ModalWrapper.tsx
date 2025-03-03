import { Text, Modal, ModalProps } from '@mantine/core';

type ModalNiceHeaderProps = { title: string };

const ModalNiceHeader: React.FC<ModalNiceHeaderProps> = (props) => {
  const { title } = props;

  return (
    <Text size="md" fw={700} variant="text">
      {title}
    </Text>
  );
};

type ModalsWrapperProps = React.PropsWithChildren<{
  title: string;
  opened: boolean;
  onClose: () => void;
  modalProps?: Partial<ModalProps>;
}>;

const ModalsWrapper = (props: ModalsWrapperProps) => {
  const { title, opened, onClose, children, modalProps = {} } = props;

  return (
    <Modal
      centered={true}
      title={title && <ModalNiceHeader title={title} />}
      opened={opened}
      onClose={onClose}
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

export default ModalsWrapper;
