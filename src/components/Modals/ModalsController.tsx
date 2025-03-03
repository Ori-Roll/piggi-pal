import { Text, Modal } from '@mantine/core';
import { useAddChildAccountModalToggle } from '@/store/useModalActive';
import AddNewChildAccountModal from './AddNewChildAccountModal';

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
    addChildAccount: {
      name: 'addChildAccount',
      title: <ModalNiceHeader title="Add New child account" />,
      active: useAddChildAccountModalToggle((state) => state.modalActive),
      deactivate: useAddChildAccountModalToggle((state) => state.setFalse),
      component: AddNewChildAccountModal,
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
      title={modals.addChildAccount.title}
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
