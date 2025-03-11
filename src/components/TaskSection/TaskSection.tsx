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
import style from './TaskSection.module.css';
import complete from '@/pages/api/tasks/complete';

type TaskSectionProps = {
  childAccount: ChildAccountWithTasks;
};

function TaskSection(props: TaskSectionProps) {
  const { childAccount } = props;

  const queryClient = useQueryClient();

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

    variables: mutatingTaskVariables,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      await tasksService.completeTask(taskId, childAccount.id);
    },
    onMutate: updateChildAccountOnTaskCheck,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const onCheck = (taskId: string) => {
    updateTaskCheck(taskId);
  };

  return childAccount.tasks.length > 0 ? (
    <CardsGrid
      emptyMessage={
        childAccount.tasks.length === 0 ? 'You have no tasks yet' : undefined
      }
    >
      {childAccount.tasks.map((task: Task) =>
        task.amount ? (
          <DoableCard
            key={task.id}
            // editableDeletablep
            checkable
            onCheck={() => {
              onCheck(task.id);
            }}
            checked={task.completed}
            loading={task.id === TEMPORARY}
            // onEdit={() => {}}
            // onDelete={() => {}}
            checking={
              updateTaskCheckIsPending && mutatingTaskVariables === task.id
            }
          >
            <Text fw={700}>{task.title}</Text>
            <Text c="dimmed">{task.description}</Text>
            {/* <AnimatedShake delay={i * 100}> */}
            <AmountWithSign amount={task.amount} />
            {/* </AnimatedShake> */}
          </DoableCard>
        ) : null
      )}
    </CardsGrid>
  ) : null;
}

export default TaskSection;
