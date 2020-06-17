import { Observable } from '../../utils/observableHook/observable';

export class AccountService {
    account = new Observable('');

    setAccount(account) {
        this.account.set(account);
    }
}