import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const ModalStyle: Story = {
  render: () => (
    <Card className="max-w-md mx-auto p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Set Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <input type="text" placeholder="5:00" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Start</Button>
      </CardFooter>
    </Card>
  ),
};

export const TimerContainer: Story = {
  render: () => (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-lg">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="text-6xl font-bold font-mono">5:00</div>
          <div className="mt-4 flex gap-2 justify-center">
            <Button variant="ghost" size="icon">▶️</Button>
            <Button variant="outline" size="icon">↻</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};