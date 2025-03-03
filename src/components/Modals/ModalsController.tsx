import { Text, Modal } from '@mantine/core';
import { useAddAccountModalToggle } from '@/store/useModalActive';
import AddNewAccountModal from './AddNewAccountModal';

type ModalNiceHeaderProps = { title: string };

const ModalNiceHeader: React.FC<ModalNiceHeaderProps> = (props) => {
  const { title } = props;

  return (
    <Text
      size="xl"
      fw={700}
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
    >
      {title}
    </Text>
  );
};

type ModalsControllerProps = {};

// TODO: This is not a nice implementation, but it works for now - change later

const ModalsController = (props: ModalsControllerProps) => {
  const {} = props;
  const modals = {
    addAccount: {
      name: 'addAccount',
      title: <ModalNiceHeader title="Add New Account" />,
      active: useAddAccountModalToggle((state) => state.modalActive),
      deactivate: useAddAccountModalToggle((state) => state.setFalse),
      component: AddNewAccountModal,
    },
  };

  const deactivateAll = () => {
    Object.values(modals).forEach((modal) => {
      if (modal.active) modal.deactivate();
    });
  };

  const activeModals =
    Object.values(modals).filter((modal) => modal.active).length > 0;

  return (
    <Modal
      opened={activeModals}
      onClose={() => {}}
      title={modals.addAccount.title}
      centered={true}
    >
      {Object.values(modals).map((modal) =>
        modal.active ? (
          <modal.component key={modal.name} onSubmitCallback={deactivateAll} />
        ) : null
      )}
    </Modal>
  );
};

export default ModalsController;
