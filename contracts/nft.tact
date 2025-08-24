// staking.tact
import "@stdlib/deploy";

message LockTON {
    queryId: Int as uint64;
    amount: Int as coins;
    goalDays: Int as uint32;
    bonusPercent: Int as uint8;
}

message ReleaseLock {
    queryId: Int as uint64;
    user: Address;
    success: Bool;
}

struct LockData {
    user: Address;
    lockedAmount: Int as coins;
    lockTime: Int as uint32;
    goalDays: Int as uint32;
    bonusPercent: Int as uint8;
    released: Bool;
}

contract LanguageStakingEscrow with Deployable {
    owner: Address;
    locks: map<Address, LockData>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(msg: LockTON) {
        require(context().value >= msg.amount, "Insufficient value sent");
        require(self.locks.get(sender()) == null, "Already locked");

        self.locks.set(sender(), LockData {
            user: sender(),
            lockedAmount: msg.amount,
            lockTime: now(),
            goalDays: msg.goalDays,
            bonusPercent: msg.bonusPercent,
            released: false
        });

        if (context().value > msg.amount) {
            send(SendParameters {
                to: sender(),
                value: context().value - msg.amount,
                mode: 64,
                body: "Excess refunded".asComment()
            });
        }
    }

    receive(msg: ReleaseLock) {
        require(sender() == self.owner, "Only owner can release");

        let lockOpt = self.locks.get(msg.user);
        require(lockOpt != null, "No lock found");
        let lock = lockOpt!!;

        require(!lock.released, "Already released");

        let amountToSend: Int = 0;
        if (msg.success) {
            let bonus = (lock.lockedAmount * lock.bonusPercent) / 100;
            amountToSend = lock.lockedAmount + bonus;
        } else {
            amountToSend = (lock.lockedAmount * 90) / 100;
        }

        send(SendParameters {
            to: lock.user,
            value: amountToSend,
            mode: 64,
            body: "Lock released".asComment()
        });

        lock.released = true;
        self.locks.set(msg.user, lock);
    }

    get fun getLock(user: Address): LockData? {
        return self.locks.get(user);
    }
}