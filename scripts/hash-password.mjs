import bcrypt from "bcryptjs";
const pwd = process.argv[2];
if (!pwd || pwd.length < 12) {
  console.error('Usage : npm run hash-password -- "mot-de-passe-d-au-moins-12-caracteres"');
  process.exit(1);
}
const hash = bcrypt.hashSync(pwd, 12);
// base64 : évite l'expansion des "$" par le chargeur .env
console.log("ADMIN_PASSWORD_HASH=" + Buffer.from(hash).toString("base64"));
