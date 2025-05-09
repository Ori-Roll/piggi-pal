import { Text } from '@mantine/core';
import { Task } from '@prisma/client';
import {
  ChildAccountWithAllData,
  ChildAccountWithTasks,
} from '@/types/dataTypes';
import AmountWithSign from '@/components/base/AmountWithSign/AmountWithSign';
import DoableCard from '@/components/base/DoableCard/DoableCard';
import CardsGrid from '@/components/base/CardsGrid/CardsGrid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import tasksService from '@/APIService/tasks';
import { TEMPORARY } from '@/common/consts';
import { useUpdateOnMutationCallback } from '@/hooks/utilHooks';
import { useEditMode } from '@/store/useEditMode';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import style from './TaskSection.module.css';

type TaskSectionProps = {
  childAccount: ChildAccountWithTasks;
};

function TaskSection(props: TaskSectionProps) {
  const { childAccount } = props;

  const queryClient = useQueryClient();
  const editMode = useEditMode((state) => state.edit);

  // TODO: Move these to a custom hook
  // Check task mutation

  const updateChildAccountOnTaskCheck = useUpdateOnMutationCallback(
    ['currentChildAccount', childAccount.id],
    (newTaskId: Partial<Task>) => (old: ChildAccountWithAllData) => {
      const newTasks = old.tasks.map((task) => {
        if (task.id === newTaskId) {
          return { ...task, completed: true };
        }
        return task;
      });

      return {
        ...old,
        tasks: newTasks || [],
      };
    }
  );

  const {
    mutateAsync: updateTaskCheck,
    isPending: updateTaskCheckIsPending,
    variables: mutatingUpdatingTaskVariables,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      await tasksService.completeTask(taskId, childAccount.id);
    },
    onMutate: updateChildAccountOnTaskCheck,
    onSettled: async () => {
      await queryClient.cancelQueries({
        queryKey: ['currentChildAccount'],
      });
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  // Delete task mutation

  const updateChildAccountOnTaskDelete = useUpdateOnMutationCallback(
    ['currentChildAccount', childAccount.id],
    (newTaskId: Partial<Task>) => (old: ChildAccountWithAllData) => {
      const newTasks = old.tasks.filter((task) => task.id !== newTaskId);
      return {
        ...old,
        tasks: newTasks || [],
      };
    }
  );

  const {
    mutateAsync: updateTaskDelete,
    isPending: updateTaskDeleteIsPending,
    variables: mutatingDeleteTaskVariables,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      await tasksService.deleteTask(taskId);
    },
    onMutate: updateChildAccountOnTaskDelete,
    onSettled: async () => {
      await queryClient.cancelQueries({
        queryKey: ['currentChildAccount'],
      });
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const onCheck = (taskId: string) => {
    updateTaskCheck(taskId);
  };

  const onDelete = (taskId: string) => {
    updateTaskDelete(taskId);
  };

  if (childAccount.tasks.length === 0) {
    return (
      <NothingHere>
        {editMode
          ? `Your child has no tasks to perform`
          : `You have no tasks you can do`}
      </NothingHere>
    );
  }

  return childAccount.tasks.length > 0 ? (
    <CardsGrid
      emptyMessage={
        childAccount.tasks.length === 0 ? 'You have no tasks yet' : undefined
      }
    >
      {childAccount.tasks.map((task: Task) =>
        task.amount ? (
          <DoableCard<any> //TODO: Fix this any
            key={task.id}
            // editableDeletablep
            onCheck={() => {
              onCheck(task.id);
            }}
            checked={task.completed}
            loading={
              task.id === TEMPORARY || mutatingDeleteTaskVariables === task.id
            }
            checkable={!editMode}
            editableDeletable={editMode}
            onEdit={editMode ? () => {} : undefined}
            onDelete={editMode ? () => onDelete(task.id) : undefined}
            checking={
              updateTaskCheckIsPending &&
              mutatingUpdatingTaskVariables === task.id
            }
          >
            <Text fw={700}>{task.title}</Text>
            <Text c="dimmed">{task.description}</Text>
            <AmountWithSign amount={task.amount} fontSize={2.2} />
          </DoableCard>
        ) : null
      )}
    </CardsGrid>
  ) : null;
}

export default TaskSection;
