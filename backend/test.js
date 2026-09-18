// Verification test for Aura Backend API Contracts, Idempotency & Cryptographic Scrubbing
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting Aura Enterprise Contract Verification Tests against:', BASE_URL);

  try {
    // 1. Health check
    console.log('\n1. Checking /api/health...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    console.log('✅ Health status:', health);

    // 2. Lock item with Envelope Encryption (IV + Ciphertext + AuthTag)
    const testDeviceId = 'test-enclave-device-' + Date.now();
    const testIdempotencyKey = 'uuid-' + Date.now() + '-idem-1';
    const testIv = 'a1b2c3d4e5f60718293a4b5c';
    const testCipher = '7890abcdef1234567890abcdef123456';
    const testAuthTag = 'feedbeefcafebabefeedbeefcafebabe';

    console.log('\n2. Testing POST /api/vault/lock (Zero-Knowledge Envelope Contract)...');
    const lockRes1 = await fetch(`${BASE_URL}/api/vault/lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': testIdempotencyKey
      },
      body: JSON.stringify({
        id: testIdempotencyKey,
        deviceId: testDeviceId,
        iv: testIv,
        ciphertext: testCipher,
        authTag: testAuthTag,
        encryptedContent: `ENV:${testIv}:${testCipher}:${testAuthTag}`,
        lockDurationHours: 8,
        version: 1
      })
    });

    const lockData1 = await lockRes1.json();
    console.log('Initial lock response status:', lockRes1.status);
    console.log('Response body:', lockData1);

    if (lockRes1.status !== 201 || !lockData1.success || lockData1.item?.id !== testIdempotencyKey) {
      throw new Error('Lock contract failed or did not respect client idempotency key!');
    }
    console.log('✅ POST /api/vault/lock Envelope Contract Verified!');

    // 3. Test Idempotent Retry with same ID
    console.log('\n3. Testing Idempotency Guard (Resending same request)...');
    const lockRes2 = await fetch(`${BASE_URL}/api/vault/lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': testIdempotencyKey
      },
      body: JSON.stringify({
        id: testIdempotencyKey,
        deviceId: testDeviceId,
        iv: testIv,
        ciphertext: testCipher,
        authTag: testAuthTag,
        encryptedContent: `ENV:${testIv}:${testCipher}:${testAuthTag}`,
        lockDurationHours: 8,
        version: 1
      })
    });

    const lockData2 = await lockRes2.json();
    console.log('Idempotent retry response status:', lockRes2.status);
    if (lockRes2.status !== 200 || !lockData2.item?.is_idempotent) {
      throw new Error('Idempotency failed: Duplicate write was not prevented!');
    }
    console.log('✅ Idempotent Write Protection Verified!');

    // 4. Test Cryptographic Scrubbing Endpoint (POST /api/vault/scrub)
    console.log('\n4. Testing POST /api/vault/scrub (GDPR/HIPAA Physical Erasure)...');
    const scrubRes = await fetch(`${BASE_URL}/api/vault/scrub`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: testIdempotencyKey, deviceId: testDeviceId })
    });
    const scrubData = await scrubRes.json();
    console.log('Scrub result:', scrubData);
    if (!scrubData.success || !scrubData.scrubbed) {
      throw new Error('Cryptographic erasure failed!');
    }
    console.log('✅ Cryptographic Physical Erasure Verified!');

    // 5. Test expired lock item retrieval
    console.log('\n5. Testing expired lock item retrieval...');
    const expiredId = 'uuid-' + Date.now() + '-expired';
    await fetch(`${BASE_URL}/api/vault/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: expiredId,
        deviceId: testDeviceId,
        encryptedContent: 'ENV:iv:cipher:tag',
        lockDurationHours: 0.0001
      })
    });

    await new Promise((r) => setTimeout(r, 600));

    const unlockedRes = await fetch(`${BASE_URL}/api/vault/unlocked/${testDeviceId}`);
    const unlockedData = await unlockedRes.json();
    console.log('Unlocked items count:', unlockedData.items.length);
    if (unlockedData.items.length === 0) {
      throw new Error('Unlocked item missing!');
    }
    console.log('✅ GET /api/vault/unlocked/:deviceId Contract Verified!');

    console.log('\n🎉 ALL ENTERPRISE API CONTRACT & SANITIZATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
