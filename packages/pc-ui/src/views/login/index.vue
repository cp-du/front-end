<template>
    <main class="login-shell" @pointermove="trackPointer" @pointerleave="centerEyes">
        <section class="mascot-panel" aria-hidden="true">
            <div class="mascot-stage" :class="[`is-${mood}`, { 'is-glancing': isGlancing }]">
                <div ref="purpleRef" class="character purple character-float-one" :style="characterStyle('purple')">
                    <div class="face" :style="faceStyle('purple')">
                        <span class="eye"><i :style="pupilStyle('purple', 1)" /></span>
                        <span class="eye"><i :style="pupilStyle('purple', 1)" /></span>
                    </div>
                    <span class="mouth" :style="mouthStyle('purple')" />
                </div>

                <div ref="orangeRef" class="character orange character-float-two" :style="characterStyle('orange')">
                    <div class="face" :style="faceStyle('orange')">
                        <span class="eye"><i :style="pupilStyle('orange', 0.85)" /></span>
                        <span class="eye"><i :style="pupilStyle('orange', 0.85)" /></span>
                    </div>
                    <span class="mouth" :style="mouthStyle('orange')" />
                </div>

                <div ref="blackRef" class="character black character-float-three" :style="characterStyle('black')">
                    <div class="face" :style="faceStyle('black')">
                        <span class="eye"><i :style="pupilStyle('black', 0.7)" /></span>
                        <span class="eye"><i :style="pupilStyle('black', 0.7)" /></span>
                    </div>
                    <span class="mouth" :style="mouthStyle('black')" />
                </div>

                <div ref="yellowRef" class="character yellow character-float-four" :style="characterStyle('yellow')">
                    <div class="face" :style="faceStyle('yellow')">
                        <span class="eye"><i :style="pupilStyle('yellow', 0.9)" /></span>
                        <span class="eye"><i :style="pupilStyle('yellow', 0.9)" /></span>
                    </div>
                    <span class="mouth" :style="mouthStyle('yellow')" />
                </div>
            </div>
        </section>

        <section class="form-panel">
            <form class="login-form" novalidate @submit.prevent="submitLogin">
                <header class="form-heading">
                    <h1>Welcome back!</h1>
                    <p>Please enter your details</p>
                </header>

                <div class="field" :class="{ 'has-error': attempted && !identifier.trim() }">
                    <label for="identifier">Username or email</label>
                    <input id="identifier" v-model="identifier" type="text" autocomplete="username"
                        placeholder="Enter your username or email" @focus="setMood('attentive')" @blur="restoreIdle" />
                    <span v-if="attempted && !identifier.trim()" class="field-error">Username or email is
                        required</span>
                </div>

                <div class="field" :class="{ 'has-error': attempted && !password }">
                    <label for="password">Password</label>
                    <div class="password-control">
                        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                            autocomplete="current-password" placeholder="Enter your password" @focus="setMood('shy')"
                            @blur="restoreIdle" />
                        <button class="visibility-button" type="button"
                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                            :title="showPassword ? 'Hide password' : 'Show password'"
                            @click="showPassword = !showPassword">
                            <svg v-if="!showPassword" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle cx="12" cy="12" r="2.8" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="m3 3 18 18M10.6 6.2A10 10 0 0 1 12 6c6.1 0 9.5 6 9.5 6a14 14 0 0 1-2.2 2.8M6.4 6.4C3.9 8.1 2.5 12 2.5 12s3.4 6 9.5 6a9 9 0 0 0 3.2-.6M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                            </svg>
                        </button>
                    </div>
                    <span v-if="attempted && !password" class="field-error">Password is required</span>
                </div>

                <div class="form-options">
                    <label class="remember-option">
                        <input v-model="remember" type="checkbox" />
                        <span class="checkmark" />
                        Remember for 30 days
                    </label>
                    <button class="text-button" type="button">Forgot password?</button>
                </div>

                <button class="primary-button" type="submit" :disabled="isSubmitting" :aria-busy="isSubmitting">
                    <span v-if="isSubmitting">Logging in...</span>
                    <span v-else-if="mood === 'success'">Welcome!</span>
                    <span v-else>Log In</span>
                </button>

                <p class="signup-prompt">
                    Don't have an account?
                    <button type="button">Sign Up</button>
                </p>

                <p class="form-status" :class="{ 'is-error': loginError }" aria-live="polite">{{ statusMessage }}</p>
            </form>
        </section>
    </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Http, store } from "@du/utils";

const http = new Http({ baseURL: "/api" });
type Mood = "idle" | "attentive" | "shy" | "surprised" | "success";
type CharacterKind = "purple" | "black" | "orange" | "yellow";

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    menus: any[];
    user: any;
};

const identifier = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);
const attempted = ref(false);
const isSubmitting = ref(false);
const loginError = ref(false);
const mood = ref<Mood>("idle");
const pointer = ref({ x: 0, y: 0, active: false });
const statusMessage = ref("");
const isGlancing = ref(false);
const isPurplePeeking = ref(false);
const purpleRef = ref<HTMLElement>();
const blackRef = ref<HTMLElement>();
const orangeRef = ref<HTMLElement>();
const yellowRef = ref<HTMLElement>();
let moodTimer: ReturnType<typeof setTimeout> | undefined;
let glanceTimer: ReturnType<typeof setTimeout> | undefined;
let peekTimer: ReturnType<typeof setTimeout> | undefined;

const characterRefs = {
    purple: purpleRef,
    black: blackRef,
    orange: orangeRef,
    yellow: yellowRef
};

const getPosition = (kind: CharacterKind) => {
    const element = characterRefs[kind].value;
    if (!element || !pointer.value.active) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = element.getBoundingClientRect();
    const deltaX = pointer.value.x - (rect.left + rect.width / 2);
    const deltaY = pointer.value.y - (rect.top + rect.height / 3);

    return {
        faceX: Math.max(-15, Math.min(15, deltaX / 20)),
        faceY: Math.max(-10, Math.min(10, deltaY / 30)),
        bodySkew: Math.max(-6, Math.min(6, -deltaX / 120))
    };
};

const isPasswordVisible = () => password.value.length > 0 && showPassword.value;
const isHidingPassword = () => password.value.length > 0 && !showPassword.value;

const pupilStyle = (kind: CharacterKind, strength: number) => {
    let { faceX: x, faceY: y } = getPosition(kind);

    if (isPasswordVisible()) {
        x = kind === "purple" && isPurplePeeking.value ? 4 : kind === "black" ? -4 : -5;
        y = kind === "purple" && isPurplePeeking.value ? 5 : -4;
    } else if (isGlancing.value && kind === "purple") {
        x = 3;
        y = 4;
    } else if (isGlancing.value && kind === "black") {
        x = 0;
        y = -4;
    } else {
        const length = Math.hypot(x, y) || 1;
        const distance = Math.min(length, 5 * strength);
        x = (x / length) * distance;
        y = (y / length) * distance;
    }

    return { transform: `translate(${x}px, ${y}px)` };
};

const faceStyle = (kind: CharacterKind) => {
    let { faceX: x, faceY: y } = getPosition(kind);

    if (isPasswordVisible()) {
        x = kind === "purple" ? -16 : -12;
        y = -7;
    } else if (isGlancing.value && kind === "purple") {
        x = 10;
        y = 15;
    } else if (isGlancing.value && kind === "black") {
        x = 8;
        y = -15;
    }

    return { transform: `translate(calc(-50% + ${x}px), ${y}px)` };
};

const mouthStyle = (kind: CharacterKind) => {
    const { faceX, faceY } = getPosition(kind);
    const x = isPasswordVisible() ? -12 : faceX;
    const y = isPasswordVisible() ? -7 : faceY;
    return { transform: `translate(calc(-50% + ${x}px), ${y}px)` };
};

const characterStyle = (kind: CharacterKind) => {
    const { bodySkew } = getPosition(kind);
    const passwordVisible = isPasswordVisible();
    const hidingPassword = isHidingPassword();
    const typingEmail = mood.value === "attentive";
    let transform = `skewX(${bodySkew}deg)`;

    if (passwordVisible) transform = "skewX(0deg)";

    if (kind === "purple" && !passwordVisible && (typingEmail || hidingPassword)) {
        transform = `skewX(${bodySkew - 12}deg) translateX(40px)`;
    }

    if (kind === "black" && !passwordVisible) {
        if (isGlancing.value) transform = `skewX(${bodySkew * 1.5 + 10}deg) translateX(20px)`;
        else if (typingEmail || hidingPassword) transform = `skewX(${bodySkew * 1.5}deg)`;
    }

    return {
        transform,
        height: kind === "purple" && (typingEmail || hidingPassword) ? "90%" : undefined
    };
};

const clearMoodTimer = () => {
    if (moodTimer) clearTimeout(moodTimer);
};

const getSafeRedirect = (redirect?: string | null) => {
    if (!redirect) return undefined;

    const target = new URL(redirect, window.location.origin);
    if (target.origin !== window.location.origin) return undefined;
    return `${target.pathname}${target.search}${target.hash}`;
};

const setMood = (nextMood: Mood) => {
    clearMoodTimer();
    mood.value = nextMood;

    if (nextMood === "attentive") {
        if (glanceTimer) clearTimeout(glanceTimer);
        isGlancing.value = true;
        glanceTimer = setTimeout(() => {
            isGlancing.value = false;
        }, 800);
    } else {
        isGlancing.value = false;
    }
};

const restoreIdle = () => {
    window.setTimeout(() => {
        const wasFieldFocused = mood.value === "attentive" || mood.value === "shy";
        if (!document.activeElement?.matches("input") && wasFieldFocused) setMood("idle");
    }, 80);
};

const trackPointer = (event: PointerEvent) => {
    if (mood.value === "surprised") return;
    pointer.value = { x: event.clientX, y: event.clientY, active: true };
};

const centerEyes = () => {
    pointer.value = { x: 0, y: 0, active: false };
};

const submitLogin = async () => {
    if (isSubmitting.value) return;

    attempted.value = true;
    loginError.value = false;
    clearMoodTimer();

    if (!identifier.value.trim() || !password.value) {
        mood.value = "surprised";
        loginError.value = true;
        statusMessage.value = "Please complete both fields.";
        moodTimer = setTimeout(() => {
            mood.value = "idle";
        }, 1700);
        return;
    }

    isSubmitting.value = true;
    statusMessage.value = "Signing you in...";

    console.log('12312312312')

    try {
        const res = await http.post<LoginResponse>('/auth/login', {
            identifier: identifier.value.trim(),
            password: password.value,
        })

        console.log(res, 'res')

        debugger

        mood.value = "success";

        const time = remember ? 30 * 24 * 60 * 60 * 1000 : undefined;

        store.setStorage('accessToken', res.data!.accessToken, time);
        store.setStorage('refreshToken', res.data!.refreshToken, time);
        store.setStorage('user', res.data!.user, time);
        store.setStorage('menus', res.data!.menus, time);

        const redirectUrl =
            getSafeRedirect(new URLSearchParams(window.location.search).get("redirect")) ||
            "/";
        moodTimer = setTimeout(() => window.location.assign(redirectUrl), 700);

    } catch (error) {
        console.log(error, 'error')

        debugger
        mood.value = "surprised";
        loginError.value = true;
        statusMessage.value = error instanceof Error ? error.message : "Unable to log in. Please try again.";
        moodTimer = setTimeout(() => {
            mood.value = "idle";
        }, 1700);
    } finally {
        isSubmitting.value = false;
    }
};

const schedulePeek = () => {
    if (peekTimer) clearTimeout(peekTimer);
    if (!isPasswordVisible()) return;

    peekTimer = setTimeout(
        () => {
            isPurplePeeking.value = true;
            peekTimer = setTimeout(() => {
                isPurplePeeking.value = false;
                schedulePeek();
            }, 800);
        },
        Math.random() * 3000 + 2000
    );
};

watch([showPassword, () => password.value.length], () => {
    isPurplePeeking.value = false;
    schedulePeek();
});

watch([identifier, password], () => {
    if (!loginError.value) return;
    loginError.value = false;
    statusMessage.value = "";
});

onBeforeUnmount(() => {
    clearMoodTimer();
    if (glanceTimer) clearTimeout(glanceTimer);
    if (peekTimer) clearTimeout(peekTimer);
});

</script>

<style scoped>
:global(*) {
    box-sizing: border-box;
}

:global(html),
:global(body),
:global(#app) {
    min-height: 100%;
    margin: 0;
}

:global(body) {
    min-width: 320px;
    background: #171717;
    color: #161720;
}

:global(button),
:global(input) {
    font: inherit;
    letter-spacing: 0;
}

.login-shell {
    display: grid;
    grid-template-columns: 56% 44%;
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
}

.mascot-panel {
    position: relative;
    overflow: hidden;
    min-height: calc(100vh - 24px);
    background: #e9e9e9;
}

.mascot-stage {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: min(72%, 650px);
    height: 50%;
    min-height: 390px;
    transform: translateX(-50%);
}

.character {
    position: absolute;
    bottom: 0;
    transform-origin: center bottom;
    transition:
        height 700ms ease-in-out,
        transform 700ms ease-in-out,
        filter 280ms ease;
    will-change: height, transform;
}

.purple {
    z-index: 1;
    bottom: -4px;
    left: 36%;
    width: 27%;
    height: 82%;
    min-height: 320px;
    background: #8128d5;
    clip-path: polygon(3% 0, 97% 0, 100% 100%, 0 100%);
}

.orange {
    z-index: 3;
    left: 0;
    width: 54%;
    height: 42%;
    min-height: 164px;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background: #ff6530;
}

.black {
    z-index: 2;
    left: 57%;
    width: 21%;
    height: 55%;
    min-height: 212px;
    background: #171717;
    clip-path: polygon(0 2%, 96% 0, 100% 100%, 2% 100%);
}

.yellow {
    z-index: 4;
    right: 1%;
    width: 23%;
    height: 53%;
    min-height: 204px;
    border-radius: 999px 999px 0 0;
    background: #ffd611;
}

.face {
    position: absolute;
    display: flex;
    gap: clamp(12px, 2vw, 22px);
    top: 14%;
    left: 50%;
    transform: translateX(-50%);
    transition: transform 240ms ease-out;
}

.eye {
    position: relative;
    display: block;
    width: clamp(20px, 2.5vw, 27px);
    height: clamp(20px, 2.5vw, 27px);
    overflow: hidden;
    border-radius: 50%;
    background: #fff;
    transition:
        height 160ms ease,
        transform 260ms ease;
}

.eye i {
    position: absolute;
    top: 31%;
    left: 31%;
    width: 38%;
    height: 38%;
    border-radius: 50%;
    background: #121212;
    transition: transform 90ms linear;
}

.mouth {
    position: absolute;
    top: 25%;
    left: 50%;
    width: 24px;
    height: 4px;
    border-radius: 999px;
    background: #111;
    transform: translateX(-50%);
    transition:
        all 220ms ease,
        transform 240ms ease-out;
}

.black .mouth {
    width: 13px;
    height: 13px;
    border: 3px solid #000;
    background: transparent;
}

.mascot-stage.is-idle .purple .eye {
    animation: blink 5.7s ease-in-out 1.2s infinite;
}

.mascot-stage.is-idle .orange .eye {
    animation: blink 6.4s ease-in-out 3.1s infinite;
}

.mascot-stage.is-idle .black .eye {
    animation: blink 5.1s ease-in-out 2.3s infinite;
}

.mascot-stage.is-idle .yellow .eye {
    animation: blink 7.2s ease-in-out 4.4s infinite;
}

.mascot-stage.is-surprised .character {
    animation: surprise-bounce 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.mascot-stage.is-surprised .eye {
    transform: scale(1.2);
}

.mascot-stage.is-surprised .eye i {
    top: 34%;
    left: 34%;
    width: 32%;
    height: 32%;
    transform: none !important;
}

.mascot-stage.is-surprised .mouth {
    width: 18px;
    height: 23px;
    border: 0;
    border-radius: 50%;
    background: #111;
}

.mascot-stage.is-success .mouth {
    width: 30px;
    height: 15px;
    border: 0;
    border-bottom: 4px solid #111;
    border-radius: 0 0 50% 50%;
    background: transparent;
}

.mascot-stage.is-success .character {
    animation: happy-hop 700ms ease-in-out both;
}

.mascot-stage:not(.is-surprised, .is-success) .character-float-one {
    animation: gentle-float 4.6s ease-in-out infinite;
}

.mascot-stage:not(.is-surprised, .is-success) .character-float-two {
    animation: gentle-float 5.2s ease-in-out -1.5s infinite;
}

.mascot-stage:not(.is-surprised, .is-success) .character-float-three {
    animation: gentle-float 4.8s ease-in-out -2.2s infinite;
}

.mascot-stage:not(.is-surprised, .is-success) .character-float-four {
    animation: gentle-float 5.4s ease-in-out -0.7s infinite;
}

.form-panel {
    display: grid;
    place-items: center;
    min-width: 0;
    padding: 46px clamp(42px, 5vw, 104px) 28px;
    background: #fff;
}

.login-form {
    width: min(100%, 520px);
}

.form-heading {
    margin-bottom: 54px;
}

.form-heading h1 {
    margin: 0 0 14px;
    font-size: clamp(37px, 3vw, 55px);
    line-height: 1.04;
    letter-spacing: 0;
}

.form-heading p {
    margin: 0;
    color: #6e6e78;
    font-size: 20px;
}

.field {
    position: relative;
    margin-bottom: 36px;
}

.field label {
    display: block;
    margin-bottom: 16px;
    color: #282934;
    font-size: 17px;
    font-weight: 700;
}

.field input {
    width: 100%;
    height: 47px;
    padding: 0 0 13px;
    border: 0;
    border-bottom: 1px solid #c9c9ce;
    border-radius: 0;
    outline: none;
    background: transparent;
    color: #17171b;
    font-size: 18px;
    transition:
        border-color 180ms ease,
        box-shadow 180ms ease;
}

.field input::placeholder {
    color: #87878d;
    opacity: 1;
}

.field input:focus {
    border-color: #171717;
    box-shadow: 0 1px 0 #171717;
}

.password-control {
    position: relative;
}

.password-control input {
    padding-right: 44px;
}

.visibility-button {
    position: absolute;
    right: -6px;
    bottom: 8px;
    display: grid;
    width: 38px;
    height: 38px;
    padding: 8px;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #8b8b95;
    cursor: pointer;
}

.visibility-button:hover,
.visibility-button:focus-visible {
    background: #f1f1f1;
    color: #171717;
    outline: none;
}

.visibility-button svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
}

.field-error {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    color: #db3c30;
    font-size: 12px;
}

.field.has-error input {
    border-color: #db3c30;
}

.form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin: 5px 0 38px;
    color: #444650;
    font-size: 16px;
}

.remember-option {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.remember-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.checkmark {
    display: grid;
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    place-items: center;
    border: 1.5px solid #77777c;
    border-radius: 4px;
    background: #fff;
}

.remember-option input:checked+.checkmark {
    border-color: #171717;
    background: #171717;
}

.remember-option input:checked+.checkmark::after {
    width: 8px;
    height: 4px;
    border-bottom: 2px solid #fff;
    border-left: 2px solid #fff;
    content: "";
    transform: translateY(-1px) rotate(-45deg);
}

.remember-option input:focus-visible+.checkmark {
    outline: 2px solid #8e5bd8;
    outline-offset: 3px;
}

.text-button,
.signup-prompt button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #909097;
    cursor: pointer;
}

.text-button:hover,
.signup-prompt button:hover {
    color: #171717;
}

.primary-button {
    display: flex;
    width: 100%;
    height: 66px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-size: 19px;
    font-weight: 700;
    cursor: pointer;
    transition:
        transform 160ms ease,
        background 160ms ease,
        color 160ms ease;
}

.primary-button {
    border: 1px solid #171717;
    background: #171717;
    color: #fff;
}

.primary-button:hover {
    border-color: #8128d5;
    background: #8128d5;
    transform: translateY(-2px);
}

.primary-button:disabled {
    border-color: #4b4b4b;
    background: #4b4b4b;
    cursor: wait;
    transform: none;
}

.signup-prompt {
    margin: 55px 0 0;
    color: #6d6e77;
    text-align: center;
    font-size: 16px;
}

.signup-prompt button {
    color: #171717;
    font-weight: 700;
}

.form-status {
    min-height: 19px;
    margin: 13px 0 0;
    color: #73737c;
    text-align: center;
    font-size: 13px;
}

.form-status.is-error {
    color: #db3c30;
}

@keyframes gentle-float {

    0%,
    100% {
        translate: 0 0;
    }

    50% {
        translate: 0 -4px;
    }
}

@keyframes surprise-bounce {

    0%,
    100% {
        transform: translateY(0) scaleY(1);
    }

    35% {
        transform: translateY(-25px) scaleY(1.04);
    }

    62% {
        transform: translateY(2px) scaleY(0.97);
    }
}

@keyframes happy-hop {

    0%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-18px) rotate(2deg);
    }

    70% {
        transform: translateY(-5px) rotate(-1deg);
    }
}

@keyframes blink {

    0%,
    45%,
    49%,
    100% {
        scale: 1 1;
    }

    47% {
        scale: 1 0.08;
    }
}

@media (max-width: 1050px) {
    .login-shell {
        grid-template-columns: 48% 52%;
    }

    .mascot-stage {
        width: 88%;
    }

    .form-panel {
        padding-inline: 48px;
    }
}

@media (max-width: 760px) {
    .login-shell {
        display: block;
        min-height: 100dvh;
        overflow-y: auto;
        border-width: 7px;
        border-radius: 30px;
    }

    .mascot-panel {
        min-height: 250px;
    }

    .mascot-stage {
        width: min(88%, 450px);
        height: 240px;
        min-height: 0;
    }

    .purple {
        min-height: 205px;
    }

    .orange {
        min-height: 105px;
    }

    .black {
        min-height: 140px;
    }

    .yellow {
        min-height: 132px;
    }

    .eye {
        width: 18px;
        height: 18px;
    }

    .mouth {
        top: 27%;
        width: 18px;
    }

    .form-panel {
        display: block;
        padding: 34px 26px 28px;
    }

    .login-form {
        margin: 0 auto;
    }

    .brand-mark {
        width: 48px;
        height: 48px;
        margin-bottom: 28px;
    }

    .brand-mark span {
        width: 18px;
        height: 18px;
    }

    .form-heading {
        margin-bottom: 38px;
    }

    .form-heading h1 {
        font-size: 38px;
    }

    .form-heading p {
        font-size: 17px;
    }

    .field {
        margin-bottom: 32px;
    }

    .primary-button {
        height: 58px;
    }

    .signup-prompt {
        margin-top: 40px;
    }
}

@media (max-width: 430px) {
    .form-options {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
    }
}

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 1ms !important;
    }
}
</style>
