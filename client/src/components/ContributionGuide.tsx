import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface ContributionGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContributionGuide({ open, onOpenChange }: ContributionGuideProps) {
  const [copied, setCopied] = useState(false);
  const email = "ratemyfaculty.seu@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contribute to the Archive</DialogTitle>
          <DialogDescription>
            Help us build a comprehensive library of previous year questions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Copy Email */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                1
              </div>
              <h3 className="font-semibold text-lg">Copy our submission email</h3>
            </div>
            <div className="ml-11 flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <code className="flex-1 text-sm font-mono">{email}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyEmail}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 2: Ensure Quality */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                2
              </div>
              <h3 className="font-semibold text-lg">Ensure your files are clear</h3>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>Make sure your question photos/PDFs are clear and legible.</p>
            </div>
          </div>

          {/* Step 3: Compose Email */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                3
              </div>
              <h3 className="font-semibold text-lg">Compose an email with details</h3>
            </div>
            <div className="ml-11 space-y-2 text-sm">
              <p className="text-muted-foreground">Include the following information:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Faculty Name or Initial</strong> (e.g., [FBH])</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Course Title</strong> (e.g., [Differential and Integral Calculus])</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Question Type</strong> (CT, Mid, or Final)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Semester & Year</strong> (e.g., Spring 2026)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4: Send */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                4
              </div>
              <h3 className="font-semibold text-lg">Attach and send</h3>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>Attach your question files and send the email to the address above.</p>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-primary">
              Thank you for contributing! Your submissions help students prepare better for their exams.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
