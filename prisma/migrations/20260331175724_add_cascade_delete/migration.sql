-- DropForeignKey
ALTER TABLE "AuthMethod" DROP CONSTRAINT "AuthMethod_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassicAuthMethod" DROP CONSTRAINT "ClassicAuthMethod_userId_fkey";

-- AddForeignKey
ALTER TABLE "ClassicAuthMethod" ADD CONSTRAINT "ClassicAuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
