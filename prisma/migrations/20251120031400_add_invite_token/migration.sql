-- CreateTable
CREATE TABLE "GroupInviteToken" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupInviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupInviteToken_token_key" ON "GroupInviteToken"("token");

-- AddForeignKey
ALTER TABLE "GroupInviteToken" ADD CONSTRAINT "GroupInviteToken_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
