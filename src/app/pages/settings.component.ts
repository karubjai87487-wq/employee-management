import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-600">Manage your preferences and account settings</p>
      </div>

      <div class="space-y-6">
        <!-- Notification Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-4">📬 Notifications</h3>
          <div class="space-y-4">
            <label class="flex items-center cursor-pointer group">
              <input type="checkbox" checked class="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-3 text-gray-700 group-hover:text-indigo-600 transition">
                Email notifications for leave requests
              </span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input type="checkbox" checked class="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-3 text-gray-700 group-hover:text-indigo-600 transition">
                Email notifications for approvals
              </span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input type="checkbox" class="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-3 text-gray-700 group-hover:text-indigo-600 transition">
                Reminder emails 1 day before leave
              </span>
            </label>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-4">🔒 Privacy</h3>
          <div class="space-y-4">
            <div>
              <p class="text-gray-700 font-medium mb-3">Show my leave status to colleagues</p>
              <div class="flex gap-6">
                <label class="flex items-center cursor-pointer group">
                  <input type="radio" name="privacy" checked class="w-4 h-4 border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500" />
                  <span class="ml-2 text-gray-600 group-hover:text-gray-900 transition">Yes</span>
                </label>
                <label class="flex items-center cursor-pointer group">
                  <input type="radio" name="privacy" class="w-4 h-4 border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500" />
                  <span class="ml-2 text-gray-600 group-hover:text-gray-900 transition">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Data & Security -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-4">🛡️ Security</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
              Change Password
            </button>
            <button class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
              Download My Data
            </button>
          </div>
        </div>

        <!-- Help & Support -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-4">❓ Help & Support</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500">App Version</p>
              <p class="text-sm font-semibold text-gray-900">1.0.0</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500">Last Updated</p>
              <p class="text-sm font-semibold text-gray-900">Feb 2026</p>
            </div>
          </div>
          <p class="text-gray-600 text-sm mt-4 italic">
            For support, please contact your HR department
          </p>
        </div>

        <!-- Save Button -->
        <button
          (click)="saveSettings()"
          class="w-full px-4 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-bold uppercase tracking-wider"
        >
          Save Settings
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  constructor(private toastService: ToastService) { }

  ngOnInit(): void { }

  saveSettings(): void {
    this.toastService.success('Settings saved successfully');
  }
}
