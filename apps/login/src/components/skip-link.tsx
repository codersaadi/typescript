import { ReactNode } from "react";

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background-light-400 dark:focus:bg-background-dark-500 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-light-500 dark:focus:ring-primary-dark-500"
    >
      {children}
    </a>
  );
};