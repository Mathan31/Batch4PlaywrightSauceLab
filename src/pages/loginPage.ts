import { Locator,Page } from "@playwright/test";
import { BasePage } from "../core/basePage";
import { UIActions } from "../actions/uiActions";
import { Constants } from "../utils/constants";



class LoginPage extends BasePage {

    private userNameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorMessage: Locator;
    private uiActions: UIActions;

    constructor(page: Page){
        super(page);
        this.userNameInput = page.locator("#user-name");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.locator("#login-button");
        this.errorMessage = page.locator("h3[data-test='error']");
        this.uiActions = new UIActions(page);
    }

    async navigateToLoginPage(){
        await this.uiActions.navigateTo(Constants.BASE_URL);
    }

    async enterUserName(username: string){
        await this.uiActions.fill(this.userNameInput,username);
    }

    async enterPassword(password: string){
        await this.uiActions.fill(this.passwordInput,password);
    }

    async clickLogin(){
        await this.uiActions.click(this.loginButton);
    }
}