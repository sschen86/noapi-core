<template>
  <transition name="basic-header-transition">
    <div class="basic-header-wrapper">
      <a-layout-header class="basic-header">
        <div class="basic-header-inner">
          <h1 class="logo">
            <router-link to="/">
              <svg-icon type="logo" alt="logo" />
              noAPI
            </router-link>
          </h1>

          <!--
          <router-link :to="{ path: '/login' }">
            toLogin
          </router-link>
          |
          <router-link :to="{ path: '/home' }">
            tohome
          </router-link>
          |
          <router-link :to="{ path: '/api/666' }">
            toDetail
          </router-link>

          -->
          <div style="margin-left:auto">
            <a-select
              show-search
              :v-model="searchValue"
              placeholder="搜索接口"
              style="width: 200px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="onSearch"
              @change="onChange"
            >
              <a-select-option v-for="d in searchList" :key="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>
            <!-- <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" /> -->
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
// import BasicBreadcrumb from '@/components/basic-breadcrumb'
// import userMenu from './components/user-menu'
export default {
    // components: { BasicBreadcrumb, userMenu },
    props: {
        collapsed: {
            type: Boolean,
        },
    },
    data () {
        return {
            searchValue: '',
            searchList: [],
        }
    },
    methods: {
        onSearch (value) {
            if (!value) {
                this.list = []
                return
            }
            const { projectId } = this.$route.params
            this.$api.searchAPI({ projectId, value }).then((list) => {
                this.searchList = list
            })
        },
        onChange (newApiId) {
            const { projectId, apiId } = this.$route.params
            if (newApiId === Number(apiId)) {
                return
            }
            this.$router.push(`/project/${projectId}/api/${newApiId}`)
        },
    },

}
</script>

<style lang="less">
.basic-header-transition-enter-active {
    transition: all 0.25s ease;
}

.basic-header-transition-leave-active {
    transition: all 0.5s ease;
}

.basic-header-transition-enter,
.basic-header-transition-leave-to {
    opacity: 0;
}

.basic-header-wrapper {
    position: relative;
    z-index: 2;
}

.basic-header {
    padding: 0;
}

.basic-header-inner {
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    height: 64px;
    padding: 0 12px 0 0;
    position: relative;

    .trigger {
        cursor: pointer;
        font-size: 20px;
        line-height: 69px;
        padding: 0 24px;
        transition: color 0.3s;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .basic-breadcrumb {
        line-height: 63px;
        margin-right: 16px;
    }

    .logo {
        font-size: 20px;
        font-family: Avenir, -apple-system, BlinkMacSystemFont, segoe ui, Roboto,
            helvetica neue, Arial, noto sans, sans-serif, apple color emoji,
            segoe ui emoji, segoe ui symbol, noto color emoji, sans-serif;
        height: 64px;

        margin-left: 40px;

        .svg-icon {
            position: relative;
            top: 6px;
            margin-right: 4px;
        }
        svg {
            width: 32px;
            height: 32px;
        }
        a {
            color: #333;
            font-weight: bold;
        }
    }
}
</style>
