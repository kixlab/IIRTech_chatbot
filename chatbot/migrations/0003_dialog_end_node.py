# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-05 12:48
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0002_dialog_dialog_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='dialog',
            name='end_node',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='end', to='chatbot.Node'),
            preserve_default=False,
        ),
    ]
