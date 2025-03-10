import { Text } from '@mantine/core';
import { Task } from '@prisma/client';
import { ChildAccountWithTasks } from '@/types/dataTypes';
import AmountWithSign from '@/components/base/AmountWithSign/AmountWithSign';
import DoableCard from '@/components/base/DoableCard/DoableCard';
import CardsGrid from '@/components/base/CardsGrid/CardsGrid';
import { useMutation } from '@tanstack/react-query';
import tasksService from '@/APIService/tasks';
import { useEffect } from 'react';
import { TEMPORARY } from '@/common/consts';
// import style from './TaskSection.module.css';

type TaskSectionProps = {
  childAccount: ChildAccountWithTasks;
};

function TaskSection(props: TaskSectionProps) {
  const { childAccount } = props;

  const {
    mutateAsync: updateTask,
    isPending: updateTaskIsPending,
    variables: mutatingTaskVariables,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      await tasksService.completeTask(taskId, childAccount.id);
    },
  });

  const onCheck = (taskId: string) => {
    updateTask(taskId);
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
            checking={updateTaskIsPending && mutatingTaskVariables === task.id}
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
