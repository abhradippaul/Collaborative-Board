"use client";

import ParamsPage from "./ParamsPage";

interface Props {
  searchParams: {
    search?: string;
    favorites?: string;
    organization?: string;
  };
}

function DashboardPage({ searchParams }: Props) {
  if (
    !searchParams.search &&
    !searchParams.favorites &&
    !searchParams.organization
  ) {
    return (
      <div className="flex-1 min-h-[88dvh] p-6 flex items-center justify-center">
        Welcome to collaborative board
      </div>
    );
  }

  return <ParamsPage searchParams={searchParams} />;
}

export default DashboardPage;
