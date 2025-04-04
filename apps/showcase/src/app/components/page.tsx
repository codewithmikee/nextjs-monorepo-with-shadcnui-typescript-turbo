/**
 * @author Mikiyas Birhanu And AI
 * @description UI Components showcase page
 */
'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Modal,
} from '@packages/ui';
import FormsDemo from '@/components/forms-demo';
import DataTableDemo from '@/components/data-table-demo';

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UI Components</h1>
        <p className="text-muted-foreground mt-2">
          A showcase of shadcn/ui components used in this project
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <span className="h-4 w-4">+</span>
          </Button>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input placeholder="Default input" />
          </div>
          <div className="space-y-2">
            <Input placeholder="Disabled input" disabled />
          </div>
          <div className="space-y-2">
            <Input placeholder="With error" error="This field is required" />
          </div>
          <div className="space-y-2">
            <Input type="email" placeholder="Email input" />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content of the card.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription>With an image placeholder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                Image Placeholder
              </div>
              <p className="mt-4">Some description text here.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>A card with minimal styling and content.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      {/* Modal Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Modal</h2>
        <div>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title="Example Modal"
            description="This is a sample modal dialog"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Save</Button>
              </div>
            }
          >
            <div className="py-4">
              <p>This is the main content of the modal dialog.</p>
              <p className="mt-2">You can customize this content as needed.</p>
            </div>
          </Modal>
        </div>
      </section>

      {/* Forms Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
        <Card>
          <CardHeader>
            <CardTitle>Form Example</CardTitle>
            <CardDescription>
              Form with React Hook Form and Zod validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormsDemo />
          </CardContent>
        </Card>
      </section>

      {/* Tables Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Tables</h2>
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>
              Table with sorting, pagination, and filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTableDemo />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
