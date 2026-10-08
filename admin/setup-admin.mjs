import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlguefboinvbolnkozlc.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const targetEmail = 'hakimidigitalservices@gmail.com';
const targetPassword = 'Hakimi@5253';

if (!serviceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const { data, error: listError } = await supabase.auth.admin.listUsers();
if (listError) {
  console.error('Could not list users:', listError.message);
  process.exit(1);
}

const oldUser = data.users.find(
  u => u.email?.toLowerCase() === 'hakimidigitalservices@gamil.com' ||
       u.email?.toLowerCase() === targetEmail.toLowerCase()
);

if (!oldUser) {
  console.error('Existing admin user was not found.');
  process.exit(1);
}

const { data: updated, error: updateError } =
  await supabase.auth.admin.updateUserById(oldUser.id, {
    email: targetEmail,
    password: targetPassword,
    email_confirm: true
  });

if (updateError) {
  console.error('Could not update admin:', updateError.message);
  process.exit(1);
}

const { error: adminError } = await supabase
  .from('admin_users')
  .upsert({ user_id: oldUser.id }, { onConflict: 'user_id' });

if (adminError) {
  console.error('Admin permission update failed:', adminError.message);
  process.exit(1);
}

console.log('');
console.log('SUCCESS: Admin account updated.');
console.log('Email: ' + updated.user.email);
console.log('Password: ' + targetPassword);
console.log('');
console.log('Delete this script after successful setup.');
