# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-04 13:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Dialog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('back_up_utterance', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node_id', models.TextField(default='')),
                ('chatbot_utternace', models.TextField(default='')),
            ],
        ),
        migrations.AddField(
            model_name='dialog',
            name='convergence_node',
            field=models.ManyToManyField(related_name='convergence', to='chatbot.Node'),
        ),
        migrations.AddField(
            model_name='dialog',
            name='head_node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='head', to='chatbot.Node'),
        ),
    ]
