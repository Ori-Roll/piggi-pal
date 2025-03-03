import { Grid, Text } from '@mantine/core';
import { ChildAccount, Task } from '@prisma/client';
import { useIsMobile } from '@/hooks/configHooks';
import AmountWithSign from '@/components/base/AmountWithSign/AmountWithSign';
// import AnimatedShake from '@/components/base/Animated/AnimatedShake';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import DoableCard from '@/components/base/DoableCard/DoableCard';
import style from './TaskSection.module.css';

type TaskSectionProps = {
  childAccount: ChildAccount;
};

function TaskSection(props: TaskSectionProps) {
  const { childAccount } = props;

  const isMobile = useIsMobile();

  if (childAccount.tasks.length === 0) {
    return <NothingHere>You have no tasks yet</NothingHere>;
  }

  return childAccount.tasks.length > 0 ? (
    <Grid p="lg" gutter={isMobile ? 'md' : 'lg'} className={style.task_wrapper}>
      {childAccount.tasks.map((task: Task, i) => (
        <Grid.Col span={isMobile ? 12 : 4} key={task.id}>
          <DoableCard
            key={task.id}
            editableDeletable
            checkable
            onCheck={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            checking={false}
          >
            <Text fw={700}>{task.title}</Text>
            <Text c="dimmed">{task.description}</Text>
            {/* <AnimatedShake delay={i * 100}> */}
            <AmountWithSign amount={task.amount} />
            {/* </AnimatedShake> */}
          </DoableCard>
        </Grid.Col>
      ))}
    </Grid>
  ) : null;
}

export default TaskSection;
