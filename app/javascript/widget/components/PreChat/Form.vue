<template>
  <form
    class="flex flex-1 flex-col p-6 overflow-y-auto"
    @submit.prevent="onSubmit"
  >
    <div
      v-if="shouldShowHeaderMessage"
      class="text-black-800 text-sm leading-5"
    >
      {{ headerMessage }}
    </div>
    <form-input
      v-if="options.requireEmail"
      v-model="fullName"
      class="mt-5"
      :label="$t('PRE_CHAT_FORM.FIELDS.FULL_NAME.LABEL')"
      :placeholder="$t('PRE_CHAT_FORM.FIELDS.FULL_NAME.PLACEHOLDER')"
      type="text"
      :error="
        $v.fullName.$error ? $t('PRE_CHAT_FORM.FIELDS.FULL_NAME.ERROR') : ''
      "
    />
    <form-input
      v-if="options.requireEmail"
      v-model="emailAddress"
      class="mt-5"
      :label="$t('PRE_CHAT_FORM.FIELDS.EMAIL_ADDRESS.LABEL')"
      :placeholder="$t('PRE_CHAT_FORM.FIELDS.EMAIL_ADDRESS.PLACEHOLDER')"
      type="email"
      :error="
        $v.emailAddress.$error
          ? $t('PRE_CHAT_FORM.FIELDS.EMAIL_ADDRESS.ERROR')
          : ''
      "
    />

    <form-input
      v-if="options.requireEmail"
      v-model="phoneNumber"
      class="mt-5"
      :label="$t('PRE_CHAT_FORM.FIELDS.PHONE_NUMBER.LABEL')"
      :placeholder="$t('PRE_CHAT_FORM.FIELDS.PHONE_NUMBER.PLACEHOLDER')"
      type="text"
      :error="
        $v.phoneNumber.$error
          ? $t('PRE_CHAT_FORM.FIELDS.PHONE_NUMBER.ERROR')
          : ''
      "
    />
    
    <br>
    <div class="mb-2 text-xs font-medium text-black-800">What are you interested In?</div>
    
    <div id="radio" class="mb-2 text-xs font-medium text-black-800">
      <input type="radio" value="Business Intelligence" v-model="message" />
      <label>Business Intelligence</label><br>
      <input type="radio" value="Web Design" v-model="message" />
      <label>Web Design</label><br>
      <input type="radio" value="Web Development" v-model="message" />
      <label>Web Development</label><br>
      <input type="radio" value="Domain Names" v-model="message" />
      <label>Domain Names</label><br>
      <input type="radio" value="Other Services" v-model="message" />
      <label>Other Services</label>
    </div>

    <custom-button
      class="font-medium my-5"
      block
      :bg-color="widgetColor"
      :text-color="textColor"
      :disabled="isCreating"
    >
      <spinner v-if="isCreating" class="p-0" />
      {{ $t('START_CONVERSATION') }}
    </custom-button>
  </form>
</template>

<script>
import CustomButton from 'shared/components/Button';
import FormInput from '../Form/Input';
import FormTextArea from '../Form/TextArea';
import Spinner from 'shared/components/Spinner';
import { mapGetters } from 'vuex';
import { getContrastingTextColor } from '@chatwoot/utils';
import { required, minLength, email } from 'vuelidate/lib/validators';
import { isEmptyObject } from 'widget/helpers/utils';
import routerMixin from 'widget/mixins/routerMixin';
export default {
  components: {
    FormInput,
    FormTextArea,
    CustomButton,
    Spinner,
  },
  mixins: [routerMixin],
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  validations() {
    const identityValidations = {
      fullName: {
        required,
      },
      emailAddress: {
        required,
        email,
      },
      phoneNumber: {
        required,
      },
    };

    const messageValidation = {
      message: {
        required,
      },
    };
    // For campaign, message field is not required
    if (this.hasActiveCampaign) {
      return identityValidations;
    }
    if (this.options.requireEmail) {
      return {
        ...identityValidations,
        ...messageValidation,
      };
    }
    return messageValidation;
  },
  data() {
    return {
      fullName: '',
      emailAddress: '',
      message: '',
      phoneNumber: '',

    };
  },
  computed: {
    ...mapGetters({
      widgetColor: 'appConfig/getWidgetColor',
      isCreating: 'conversation/getIsCreating',
      activeCampaign: 'campaign/getActiveCampaign',
    }),
    textColor() {
      return getContrastingTextColor(this.widgetColor);
    },
    hasActiveCampaign() {
      return !isEmptyObject(this.activeCampaign);
    },
    shouldShowHeaderMessage() {
      return this.hasActiveCampaign || this.options.preChatMessage;
    },
    headerMessage() {
      if (this.hasActiveCampaign) {
        return this.$t('PRE_CHAT_FORM.CAMPAIGN_HEADER');
      }
      return this.options.preChatMessage;
    },
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit('submit', {
        fullName: this.fullName,
        emailAddress: this.emailAddress,
        message: this.message,
        phoneNumber: this.phoneNumber,
        activeCampaignId: this.activeCampaign.id,
      });
    },
  },
};
</script>
